import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { requireAdministrator } from "@/lib/server/auth";
import { getHomepageSlots, uploadedImage } from "@/lib/server/homepage-images";
import { db } from "@/lib/server/database.mjs";
import { imageSize } from "@/lib/image-meta";
import { ImageManager, type ManagedImage } from "./image-manager";

export default async function HomepageImagesPage() {
  await requireAdministrator();
  const slots = await getHomepageSlots();
  const histories = await db().prepare(`
    SELECT v.id,v.image_key,v.width,v.height,v.created_at,v.alt,a.name
    FROM homepage_image_versions v JOIN administrators a ON a.id=v.updated_by
    ORDER BY v.created_at DESC,v.id DESC
  `).all();
  const images: ManagedImage[] = await Promise.all(slots.map(async (slot) => {
    const intrinsic = !slot.currentVersion && imageSize(slot.src);
    const size = !slot.currentVersion && /^\/images\/[\w/.-]+$/.test(slot.src) && !slot.src.includes("..")
      ? await stat(resolve("public", `.${slot.src}`)).then((file) => file.size).catch(() => null)
      : null;
    return {
      ...slot,
      actualWidth: slot.actualWidth ?? (intrinsic ? intrinsic.width : null),
      actualHeight: slot.actualHeight ?? (intrinsic ? intrinsic.height : null),
      bytes: slot.bytes ?? size,
      history: histories.filter((row) => row.image_key === slot.key).map((row) => ({
        id: String(row.id), src: uploadedImage(String(row.id)), alt: String(row.alt),
        width: Number(row.width), height: Number(row.height), date: Number(row.created_at), name: String(row.name),
      })),
    };
  }));
  return (
    <>
      <div className="admin-heading">
        <div><p className="admin-kicker">Website management / Home page</p><h1>Image management</h1></div>
      </div>
      <ImageManager images={images} />
    </>
  );
}
