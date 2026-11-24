"use server";

import { revalidatePath } from "next/cache";
import { audit, requireAdministrator } from "@/lib/server/auth";
import { db, transaction } from "@/lib/server/database.mjs";

export async function updateInquiry(id: number, _: string, form: FormData) {
  const admin = await requireAdministrator();
  const status = String(form.get("status") ?? "");
  if (!["unread", "read", "closed"].includes(status)) return "Choose a valid status.";
  const updated = await transaction(async () => {
    const result = await db().prepare("UPDATE inquiries SET status=?,updated_at=UNIX_TIMESTAMP() WHERE id=?").run(status, id);
    if (result.changes) await audit(admin.id, `Marked inquiry ${status}`, String(id));
    return result.changes;
  });
  revalidatePath("/admin", "layout");
  return updated ? "Inquiry updated." : "This inquiry no longer exists.";
}
