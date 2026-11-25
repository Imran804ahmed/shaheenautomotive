import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db, transaction } from "./database.mjs";

export type Administrator = { id: number; email: string; name: string; role: "super_admin" | "admin" };
export const sessionCookie = "shaheen_admin";
export const now = () => Math.floor(Date.now() / 1000);
export const newToken = () => randomBytes(32).toString("base64url");
export const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const validPassword = (value: string) => value.length >= 6 && value.length <= 128;

export async function audit(administratorId: number | null, action: string, subject: string) {
  await db().prepare("INSERT INTO audit(administrator_id,action,subject) VALUES (?,?,?)").run(administratorId, action, subject);
}

export async function rateLimit(key: string, limit: number, seconds: number) {
  return transaction(async () => {
    const time = now();
    await db().prepare("DELETE FROM limits WHERE expires_at <= ?").run(time);
    await db().prepare(`
      INSERT INTO limits(bucket,expires_at,attempts) VALUES (?,?,1)
      ON DUPLICATE KEY UPDATE attempts=LEAST(attempts+1,?)
    `).run(key, time + seconds, limit + 1);
    const row = await db().prepare("SELECT attempts FROM limits WHERE bucket=?").get(key);
    return Number(row?.attempts) <= limit;
  });
}

export const getAdministrator = cache(async () => {
  const token = (await cookies()).get(sessionCookie)?.value;
  if (!token || !/^[\w-]{43}$/.test(token)) return null;
  const administrator = await db().prepare(`
    SELECT a.id,a.name,a.email,a.role FROM sessions s JOIN administrators a ON a.id=s.administrator_id
    WHERE s.token_hash=? AND s.expires_at>? AND a.active=1`).get(digest(token), now());
  return (administrator as Administrator | undefined) ?? null;
});

export async function requireAdministrator(superAdmin = false) {
  const admin = await getAdministrator();
  if (!admin) redirect("/admin/login");
  if (superAdmin && admin.role !== "super_admin") redirect("/admin/dashboard");
  return admin;
}

export async function createSession(id: number, remember: boolean, expectedHash: string) {
  const token = newToken();
  const age = remember ? 30 * 86400 : 12 * 3600;
  await db().prepare("DELETE FROM sessions WHERE expires_at <= ?").run(now());
  const inserted = await db().prepare(`
    INSERT INTO sessions SELECT ?,id,? FROM administrators WHERE id=? AND active=1 AND password_hash=?
  `).run(digest(token), now() + age, id, expectedHash);
  if (!inserted.changes) return false;
  (await cookies()).set(sessionCookie, token, {
    httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production",
    path: "/", ...(remember ? { maxAge: age } : {}),
  });
  return true;
}

export async function destroySession() {
  const jar = await cookies();
  const token = jar.get(sessionCookie)?.value;
  if (token) await db().prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(token));
  jar.delete(sessionCookie);
}
