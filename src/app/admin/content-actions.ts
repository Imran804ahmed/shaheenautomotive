"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { audit, requireAdministrator } from "@/lib/server/auth";
import { isContentKey, validatedContent } from "@/lib/server/content";
import { db, transaction } from "@/lib/server/database.mjs";

export async function saveContent(key: string, _: string, form: FormData) {
  const admin = await requireAdministrator();
  if (!isContentKey(key)) return "Unknown content section.";
  const intent = form.get("intent");
  if (intent !== "draft" && intent !== "publish" && intent !== "discard") return "Choose how to save the content.";
  const revision = Number(form.get("revision"));
  const raw = String(form.get("value") ?? "");
  let value: string;
  try {
    value = intent === "discard" ? "" : validatedContent(key, raw);
  } catch (error) {
    return error instanceof SyntaxError ? "Enter valid content." : (error as Error).message;
  }

  const outcome = await transaction(async () => {
    const refs = new Set(value.match(/\/media\/[a-f0-9-]{36}/g) ?? []);
    for (const ref of refs) {
      if (!(await db().prepare("SELECT id FROM media WHERE id=?").get(ref.slice(7)))) return "One of the referenced images is no longer available.";
    }
    const statement = {
      discard: "UPDATE cms SET draft=NULL,revision=revision+1,updated_at=UNIX_TIMESTAMP() WHERE cms_key=? AND revision=?",
      draft: "UPDATE cms SET draft=?,revision=revision+1,updated_at=UNIX_TIMESTAMP() WHERE cms_key=? AND revision=?",
      publish: "UPDATE cms SET published=?,draft=NULL,revision=revision+1,updated_at=UNIX_TIMESTAMP() WHERE cms_key=? AND revision=?",
    }[intent];
    const result = await db().prepare(statement).run(...(intent === "discard" ? [] : [value]), key, revision);
    if (!result.changes) return "This section changed since you opened it. Reload and review the latest version.";
    await audit(admin.id, { discard: "Discarded draft", draft: "Saved draft", publish: "Published content" }[intent], key);
    return "";
  });
  if (outcome) return outcome;
  if (intent === "publish") revalidatePath("/", "layout");
  redirect(`/admin/content?section=${key}&saved=${intent}`);
}
