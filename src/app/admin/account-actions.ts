"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit, createSession, destroySession, emailPattern, rateLimit, requireAdministrator, validPassword } from "@/lib/server/auth";
import { db, transaction } from "@/lib/server/database.mjs";
import { hashPassword, verifyPassword } from "@/lib/server/password.mjs";

export async function updateProfile(_: string, form: FormData) {
  const administrator = await requireAdministrator();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim().toLowerCase();
  const password = String(form.get("current") ?? "");
  if (!name || name.length > 120 || email.length > 254 || !emailPattern.test(email)) return "Enter a valid name and email.";
  if (!validPassword(password) || !(await rateLimit(`profile:${administrator.id}`, 10, 900))) return "Enter your current password or try again later.";
  const database = db();
  const existing = String((await database.prepare("SELECT password_hash FROM administrators WHERE id=?").get(administrator.id))?.password_hash ?? "");
  if (!existing || !await verifyPassword(password, existing)) return "The current password is incorrect.";
  const result = await transaction(async () => {
    if ((await database.prepare("SELECT id FROM administrators WHERE email=? AND id<>?").get(email, administrator.id))) return "That email address is already in use.";
    const changed = await database.prepare("UPDATE administrators SET name=?,email=?,updated_at=UNIX_TIMESTAMP() WHERE id=? AND active=1 AND password_hash=?")
      .run(name, email, administrator.id, existing);
    if (!changed.changes) return "Your account changed. Sign in again.";
    await database.prepare("DELETE FROM reset_tokens WHERE administrator_id=?").run(administrator.id);
    await audit(administrator.id, "Updated profile", "Account");
    return "Profile updated.";
  });
  revalidatePath("/admin", "layout");
  return result;
}

export async function changePassword(_: string, form: FormData) {
  const administrator = await requireAdministrator();
  const current = String(form.get("current") ?? "");
  const password = String(form.get("password") ?? "");
  if (!validPassword(password) || password !== form.get("confirm") || current === password) return "Enter a different new password of 14–128 characters and confirm it.";
  if (!validPassword(current) || !(await rateLimit(`password:${administrator.id}`, 10, 900))) return "Enter your current password or try again later.";
  const database = db();
  const existing = String((await database.prepare("SELECT password_hash FROM administrators WHERE id=?").get(administrator.id))?.password_hash ?? "");
  if (!existing || !await verifyPassword(current, existing)) return "The current password is incorrect.";
  const hash = await hashPassword(password);
  const result = await transaction(async () => {
    const changed = await database.prepare("UPDATE administrators SET password_hash=?,updated_at=UNIX_TIMESTAMP() WHERE id=? AND active=1 AND password_hash=?")
      .run(hash, administrator.id, existing);
    if (!changed.changes) return false;
    await database.prepare("DELETE FROM reset_tokens WHERE administrator_id=?").run(administrator.id);
    await database.prepare("DELETE FROM sessions WHERE administrator_id=?").run(administrator.id);
    await audit(administrator.id, "Changed password", "Account");
    return true;
  });
  if (!result) return "Your account changed. Sign in again.";
  await destroySession();
  if (!await createSession(administrator.id, false, hash)) redirect("/admin/login");
  redirect("/admin/account?updated=1");
}

export async function saveAdministrator(id: number, _: string, form: FormData) {
  const administrator = await requireAdministrator(true);
  const database = db();
  const role = String(form.get("role") ?? "");
  if (role !== "admin" && role !== "super_admin") return "Choose an administrator role.";

  if (!id) {
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const name = String(form.get("name") ?? "").trim();
    const password = String(form.get("password") ?? "");
    if (!name || name.length > 120 || email.length > 254 || !emailPattern.test(email) || !validPassword(password)) return "Enter a name, a valid email and a password of 14–128 characters.";
    const hash = await hashPassword(password);
    const message = await transaction(async () => {
      if (!(await database.prepare("SELECT id FROM administrators WHERE id=? AND active=1 AND role='super_admin'").get(administrator.id))) return "Your permissions changed. Sign in again.";
      if ((await database.prepare("SELECT id FROM administrators WHERE email=?").get(email))) return "That email address is already in use.";
      const result = await database.prepare("INSERT INTO administrators(name,email,password_hash,role) VALUES (?,?,?,?)").run(name, email, hash, role);
      await audit(administrator.id, "Created administrator", String(result.lastInsertRowid));
      return "Administrator created.";
    });
    revalidatePath("/admin/administrators");
    return message;
  }

  if (id === administrator.id) return "Another super administrator must change your access.";
  const active = Number(form.has("active"));
  const message = await transaction(async () => {
    if (!(await database.prepare("SELECT id FROM administrators WHERE id=? AND active=1 AND role='super_admin'").get(administrator.id))) return "Your permissions changed. Sign in again.";
    const result = await database.prepare("UPDATE administrators SET role=?,active=?,updated_at=UNIX_TIMESTAMP() WHERE id=?").run(role, active, id);
    if (!result.changes) return "This administrator no longer exists.";
    await database.prepare("DELETE FROM sessions WHERE administrator_id=?").run(id);
    await database.prepare("DELETE FROM reset_tokens WHERE administrator_id=?").run(id);
    await audit(administrator.id, "Updated administrator access", String(id));
    return "Access updated.";
  });
  revalidatePath("/admin/administrators");
  return message;
}
