import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { audit, getAdministrator } from "@/lib/server/auth";
import { db, transaction } from "@/lib/server/database.mjs";
import { getWebsiteSlots } from "@/lib/server/website-images";

const maxSize = 8 * 1024 * 1024;
const accepted: Record<string, { format: string; mime: string }> = {
  jpg: { format: "jpeg", mime: "image/jpeg" },
  jpeg: { format: "jpeg", mime: "image/jpeg" },
  png: { format: "png", mime: "image/png" },
  webp: { format: "webp", mime: "image/webp" },
  avif: { format: "heif", mime: "image/avif" },
};
const response = (message: string, status = 200) => Response.json({ message }, { status });

export async function POST(request: Request) {
  const admin = await getAdministrator();
  if (!admin) return response("Sign in to manage homepage images.", 401);
  if (request.headers.get("origin") !== (process.env.APP_ORIGIN || new URL(request.url).origin)) {
    return response("Invalid request origin.", 403);
  }
  const length = Number(request.headers.get("content-length"));
  if (length < 1 || length > maxSize + 16384) return response("The image must be no larger than 8 MB.", 413);
  if (!request.headers.get("content-type")?.startsWith("multipart/form-data;")) return response("Invalid form format.", 415);
  let form: FormData;
  try { form = await request.formData(); } catch { return response("The upload could not be read.", 400); }
  const pageKey = form.get("page");
  const slot = (await getWebsiteSlots(typeof pageKey === "string" && pageKey ? pageKey : "home")).find(({ key }) => key === form.get("key"));
  if (!slot) return response("This image slot is unavailable.", 404);
  const revision = form.get("revision");
  if (revision === null || Number(revision) !== slot.revision) return response("This image changed. Refresh and try again.", 409);
  const action = form.get("action");
  const alt = String(form.get("alt") ?? "").trim();
  if (alt.length > 300) return response("Alternative text must be 300 characters or fewer.", 400);
  const file = form.get("file");
  const variants: { data: Buffer; info: { width: number; height: number; size: number } }[] = [];
  if (action === "replace") {
    if (!(file instanceof File) || !file.size || file.size > maxSize) return response("Choose an image up to 8 MB.", 400);
    const type = accepted[file.name.split(".").at(-1)?.toLowerCase() ?? ""];
    if (!type || (file.type && file.type !== type.mime)) return response("Choose a JPEG, PNG, WebP or AVIF image.", 400);
    try {
      const source = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 25_000_000, failOn: "warning" });
      const metadata = await source.metadata();
      if (metadata.format !== type.format || (type.mime === "image/avif" && metadata.compression !== "av1") || (metadata.pages ?? 1) > 1) {
        return response("The image format does not match the file extension, or the image is animated.", 400);
      }
      const { width, height } = metadata.autoOrient;
      const ratio = slot.width / slot.height;
      const crop = slot.fit === "cover" && form.get("crop") === "1";
      if (slot.fit === "cover" && !crop && Math.abs(width / height / ratio - 1) > 0.25) {
        return response("Use the recommended aspect ratio or enable the center crop.", 400);
      }
      const availableWidth = slot.fit === "contain" ? Math.max(width, height * ratio) : Math.min(width, height * ratio);
      if (availableWidth < Math.min(480, slot.width / 2) || height < 96) {
        return response("The image is too small for this slot. Choose a higher-resolution file.", 400);
      }
      const full = Math.min(2400, Math.round(availableWidth));
      for (const size of [...new Set([480, 960, 1600, full].filter((item) => item <= full))]) {
        const resized = source.clone().rotate();
        const output = slot.fit === "contain" || crop
          ? resized.resize(size, Math.round(size / ratio), {
            fit: slot.fit, background: { r: 0, g: 0, b: 0, alpha: 0 }, withoutEnlargement: true,
          })
          : resized.resize({ width: size, withoutEnlargement: true });
        const encoded = await output.webp({ quality: 85 }).toBuffer({ resolveWithObject: true });
        if (!variants.some(({ info }) => info.width === encoded.info.width)) variants.push(encoded);
      }
    } catch {
      return response("The image could not be decoded or exceeds the dimension limit.", 400);
    }
  } else if (action !== "original" && action !== "restore" && action !== "alt") {
    return response("Invalid image operation.", 400);
  }
  const result = await transaction(async () => {
    const database = db();
    const current = await database.prepare("SELECT current_version,current_alt FROM homepage_images WHERE image_key=? AND revision=?").get(slot.key, slot.revision);
    if (!current) return false;
    let version = current.current_version as string | null;
    let nextAlt: string | null = alt;
    if (action === "replace") {
      version = randomUUID();
      const { info } = variants.at(-1)!;
      await database.prepare(`
        INSERT INTO homepage_image_versions(id,image_key,alt,width,height,file_size,updated_by)
        VALUES (?,?,?,?,?,?,?)
      `).run(version, slot.key, alt, info.width, info.height, info.size, admin.id);
      for (const { data, info: variant } of variants) {
        await database.prepare("INSERT INTO homepage_image_files(version_id,width,bytes) VALUES (?,?,?)")
          .run(version, variant.width, data);
      }
    } else if (action === "original") {
      version = null;
      nextAlt = null;
    } else if (action === "restore") {
      const previous = await database.prepare("SELECT id,alt FROM homepage_image_versions WHERE image_key=? AND id=?")
        .get(slot.key, String(form.get("version") ?? ""));
      if (!previous) return false;
      version = String(previous.id);
      nextAlt = String(previous.alt);
    }
    await database.prepare(`
      UPDATE homepage_images SET current_version=?,current_alt=?,revision=revision+1,updated_by=?,updated_at=UNIX_TIMESTAMP()
      WHERE image_key=?
    `).run(version, nextAlt, admin.id, slot.key);
    if (action === "replace") {
      const expired = await database.prepare(`
        SELECT id FROM homepage_image_versions WHERE image_key=? AND id<>? ORDER BY created_at DESC,id DESC LIMIT 100 OFFSET 4
      `).all(slot.key, version);
      for (const { id } of expired) await database.prepare("DELETE FROM homepage_image_versions WHERE id=?").run(String(id));
    }
    await audit(admin.id, `${slot.pageKey === "home" ? "Homepage" : "Website"} image ${action}`, slot.key);
    return true;
  });
  if (!result) return response("The image changed or the selected version has expired.", 409);
  if (slot.pageKey === "global") revalidatePath("/", "layout");
  else revalidatePath(slot.path, "page");
  revalidatePath("/admin/website/images", "layout");
  revalidatePath("/admin/homepage/images");
  return response(slot.pageKey === "home" ? "Homepage image saved." : "Website image saved.");
}
