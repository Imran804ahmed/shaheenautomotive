"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import sharp from "sharp";
import { audit, requireAdministrator } from "@/lib/server/auth";
import { db, transaction } from "@/lib/server/database.mjs";

export async function saveImage(id: string, _: string, form: FormData) {
  const admin = await requireAdministrator();
  const alt = String(form.get("alt") ?? "").trim();
  const image = form.get("image");
  const hasImage = image instanceof File && image.size > 0;
  if (!alt || alt.length > 300 || (!id && !hasImage)) return "Choose an image and enter alternative text.";
  let bytes: Buffer | null = null;
  if (hasImage) {
    if (image.size > 8 * 1024 * 1024) return "Images must be 8 MB or smaller.";
    try {
      const input = sharp(Buffer.from(await image.arrayBuffer()), { limitInputPixels: 25_000_000, failOn: "warning" });
      const { format } = await input.metadata();
      if (!format || !["jpeg", "png", "webp"].includes(format)) return "Upload a genuine JPEG, PNG or WebP image.";
      bytes = await input.rotate().resize(2400, 2400, { fit: "inside", withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
    } catch {
      return "This image is invalid or too large to process.";
    }
  }
  const name = hasImage ? image.name.replace(/[\u0000-\u001f]/g, "").slice(0, 150) : "";
  const result = await transaction(async () => {
    if (!id && bytes) {
      const key = randomUUID();
      await db().prepare("INSERT INTO media(id,name,alt,bytes) VALUES (?,?,?,?)").run(key, name, alt, bytes);
      await audit(admin.id, "Uploaded image", key);
      return "Image uploaded.";
    }
    if (bytes && await db().prepare("SELECT image_key FROM homepage_images WHERE instr(original_src,?)>0 LIMIT 1").get(`/media/${id}`)) {
      return "This is an original homepage image. Replace its homepage slot instead.";
    }
    const statement = bytes ? "UPDATE media SET name=?,alt=?,bytes=? WHERE id=?" : "UPDATE media SET alt=? WHERE id=?";
    const result = await db().prepare(statement).run(...(bytes ? [name, alt, bytes] : [alt]), id);
    if (!result.changes) return "This image no longer exists.";
    await audit(admin.id, bytes ? "Replaced image" : "Updated image", id);
    return "Image updated.";
  });
  revalidatePath("/admin/media");
  return result;
}

export async function deleteImage(id: string) {
  const admin = await requireAdministrator();
  const result = await transaction(async () => {
    const needle = `/media/${id}`;
    const used = await db().prepare("SELECT cms_key AS section_key FROM cms WHERE instr(published,?)>0 OR instr(draft,?)>0 LIMIT 1").get(needle, needle);
    if (used) return `Remove this image from ${used.section_key} before deleting it.`;
    const homeOriginal = await db().prepare("SELECT image_key FROM homepage_images WHERE instr(original_src,?)>0 LIMIT 1").get(needle);
    if (homeOriginal) return "This image is an original homepage asset and cannot be deleted.";
    if (!(await db().prepare("DELETE FROM media WHERE id=?").run(id)).changes) return "This image no longer exists.";
    await audit(admin.id, "Deleted image", id);
    return "Image deleted.";
  });
  revalidatePath("/admin/media");
  return result;
}
