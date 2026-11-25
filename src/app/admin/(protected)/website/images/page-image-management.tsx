import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import Link from "next/link";
import { getWebsiteSlots } from "@/lib/server/website-images";
import { getWebsiteInventory } from "@/lib/server/website-image-inventory";
import { notFound } from "next/navigation";
import { requireAdministrator } from "@/lib/server/auth";
import { uploadedImage } from "@/lib/server/homepage-images";
import { db } from "@/lib/server/database.mjs";
import { imageSize } from "@/lib/image-meta";
import { ImageManager, type ManagedImage } from "../../homepage/images/image-manager";

export async function PageImageManagement({ pageKey }: { pageKey: string }) {
  await requireAdministrator();
  const page = (await getWebsiteInventory(pageKey))[0];
  if (!page) notFound();
  const slots = await getWebsiteSlots(pageKey);
  const histories = await db().prepare(`
    SELECT v.id,v.image_key,v.width,v.height,v.created_at,v.alt,a.name
    FROM homepage_image_versions v JOIN administrators a ON a.id=v.updated_by
    JOIN website_image_pages p ON p.image_key=v.image_key
    WHERE p.page_key=? ORDER BY v.created_at DESC,v.id DESC
  `).all(pageKey);
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
        <div><p className="admin-kicker"><Link href="/admin/website/images">Website management</Link> / {page.title}</p><h1>Image management</h1></div>
        <Link className="admin-button" href={page.path} target="_blank">View live page</Link>
      </div>
      {pageKey === "global" && <p>Shared images update their intended locations across the site. Existing homepage replacements take priority in their own slots.</p>}
      <ImageManager images={images} />
    </>
  );
}
