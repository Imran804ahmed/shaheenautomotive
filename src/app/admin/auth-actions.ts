"use server";

import { redirect } from "next/navigation";
import { db, transaction } from "@/lib/server/database.mjs";
import { dummyHash, hashPassword, verifyPassword } from "@/lib/server/password.mjs";
import {
  audit, createSession, destroySession, digest, emailPattern, newToken, now, rateLimit, requireAdministrator, validPassword,
} from "@/lib/server/auth";

const resetResponse = "If this address is eligible, you’ll receive a password reset email.";

export async function login(_: string, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("password") ?? "");
  if (!emailPattern.test(email) || email.length > 254 || !validPassword(password)) return "Enter a valid email and password.";
  if (!(await rateLimit("login:global", 180, 900)) || !(await rateLimit(`login:${digest(email)}`, 8, 900))) return "Too many attempts. Try again in 15 minutes.";
  const row = await db().prepare("SELECT id,password_hash,active FROM administrators WHERE email=?").get(email);
  const valid = await verifyPassword(password, String(row?.password_hash ?? dummyHash));
  if (!valid || !row?.active) return "The email or password is incorrect.";
  await destroySession();
  if (!await createSession(Number(row.id), form.has("remember"), String(row.password_hash))) return "Account access changed. Try signing in again.";
  await db().prepare("DELETE FROM limits WHERE bucket=?").run(`login:${digest(email)}`);
  await audit(Number(row.id), "Signed in", "Admin");
  redirect("/admin/dashboard");
}

export async function logout() {
  const admin = await requireAdministrator();
  await destroySession();
  await audit(admin.id, "Signed out", "Admin");
  redirect("/admin/login");
}

export async function requestReset(_: string, form: FormData) {
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  if (!emailPattern.test(email) || email.length > 254) return "Enter a valid email address.";
  const { RESEND_API_KEY, PASSWORD_RESET_FROM, APP_ORIGIN } = process.env;
  if (!RESEND_API_KEY || !PASSWORD_RESET_FROM || !APP_ORIGIN) return "Email reset is unavailable. Contact your administrator.";
  if (!(await rateLimit("reset:global", 50, 3600)) || !(await rateLimit(`reset:${digest(email)}`, 3, 3600))) return resetResponse;
  const account = await db().prepare("SELECT id FROM administrators WHERE email=? AND active=1").get(email);
  if (!account) return resetResponse;
  const token = newToken();
  const id = Number(account.id);
  await transaction(async () => {
    await db().prepare("DELETE FROM reset_tokens WHERE administrator_id=? OR expires_at<=?").run(id, now());
    await db().prepare("INSERT INTO reset_tokens VALUES (?,?,?)").run(digest(token), id, now() + 1800);
  });
  const link = new URL("/admin/reset", APP_ORIGIN);
  link.searchParams.set("token", token);
  try {
    const result = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: PASSWORD_RESET_FROM, to: [email], subject: "Shaheen Automotive password reset",
        text: `Reset your password within 30 minutes: ${link}\nIf you did not request a reset, ignore this message.` }),
      signal: AbortSignal.timeout(8000),
    });
    if (!result.ok) throw new Error("Reset email rejected");
  } catch {
    await db().prepare("DELETE FROM reset_tokens WHERE token_hash=?").run(digest(token));
    console.error("Password reset delivery failed");
  }
  return resetResponse;
}

export async function resetPassword(_: string, form: FormData) {
  const token = String(form.get("token") ?? "");
  const password = String(form.get("password") ?? "");
  if (!/^[\w-]{43}$/.test(token)) return "This reset link is invalid or expired.";
  if (!validPassword(password) || password !== form.get("confirm")) return "Enter matching passwords of 14–128 characters.";
  if (!(await rateLimit("reset:consume", 120, 900))) return "Too many attempts. Try again later.";
  const key = digest(token);
  const query = "SELECT administrator_id FROM reset_tokens JOIN administrators ON administrators.id=administrator_id WHERE token_hash=? AND expires_at>? AND active=1";
  if (!(await db().prepare(query).get(key, now()))) return "This reset link is invalid or expired.";
  const hash = await hashPassword(password);
  const updated = await transaction(async () => {
    const entry = await db().prepare(query).get(key, now());
    if (!entry) return false;
    const id = Number(entry.administrator_id);
    await db().prepare("UPDATE administrators SET password_hash=?,updated_at=UNIX_TIMESTAMP() WHERE id=?").run(hash, id);
    await db().prepare("DELETE FROM reset_tokens WHERE administrator_id=?").run(id);
    await db().prepare("DELETE FROM sessions WHERE administrator_id=?").run(id);
    await audit(id, "Reset password", "Account");
    return true;
  });
  if (!updated) return "This reset link is invalid or expired.";
  await destroySession();
  redirect("/admin/login?reset=1");
}
