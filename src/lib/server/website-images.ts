import { cache } from "react";
import { db, transaction } from "./database.mjs";
import { uploadedImage, type HomeImages } from "./homepage-images";
import { getWebsiteInventory } from "./website-image-inventory";

type StoredSlot = {
  image_key: string; page_key: string | null; original_src: string; original_alt: string;
  current_version: string | null; current_alt: string | null; revision: number;
  updated_at: number | null; width: number | null; height: number | null; file_size: number | null;
};

export const getWebsiteSlots = cache(async (pageKey?: string) => {
  const pages = await getWebsiteInventory(pageKey);
  const slots = pages.flatMap((page) => page.slots.map((slot) => ({ ...slot, pageKey: page.key, path: page.path })));
  if (!slots.length) return [];
  const keys = slots.map(({ key }) => key);
  const query = db().prepare(`
    SELECT s.*,p.page_key,v.width,v.height,v.file_size FROM homepage_images s
    LEFT JOIN website_image_pages p ON p.image_key=s.image_key
    LEFT JOIN homepage_image_versions v ON v.id=s.current_version AND v.image_key=s.image_key
    WHERE s.image_key IN (${keys.map(() => "?").join(",")})
  `);
  const index = new Map((await query.all(...keys) as unknown as StoredSlot[]).map((row) => [row.image_key, row]));
  const missing = slots.filter(({ key }) => !index.get(key)?.page_key);
  if (missing.length) {
    await transaction(async () => {
      await db().prepare(`
        INSERT INTO homepage_images(image_key,original_src,original_alt)
        VALUES ${missing.map(() => "(?,?,?)").join(",")} ON DUPLICATE KEY UPDATE image_key=image_key
      `).run(...missing.flatMap((slot) => [slot.key, slot.src, slot.alt.slice(0, 300)]));
      await db().prepare(`
        INSERT INTO website_image_pages(image_key,page_key)
        VALUES ${missing.map(() => "(?,?)").join(",")} ON DUPLICATE KEY UPDATE image_key=image_key
      `).run(...missing.flatMap((slot) => [slot.key, slot.pageKey]));
    });
    for (const row of await query.all(...keys) as unknown as StoredSlot[]) index.set(row.image_key, row);
  }

  return slots.map((slot) => {
    const stored = index.get(slot.key)!;
    const version = stored.width ? stored.current_version : null;
    return {
      ...slot,
      src: version ? uploadedImage(version) : stored.revision ? stored.original_src : slot.src,
      alt: stored.current_alt ?? (stored.revision ? stored.original_alt : slot.alt),
      original: stored.original_src,
      revision: stored.revision, updatedAt: stored.updated_at, currentVersion: version,
      actualWidth: stored.width, actualHeight: stored.height, bytes: stored.file_size,
    };
  });
});

export const getPageImages = cache(async (page: string): Promise<HomeImages> =>
  Object.fromEntries((await getWebsiteSlots(page)).map(({ key, src, alt }) => [key, { src, alt }])));

export const getHomepageImages = cache(async (): Promise<HomeImages> =>
  Object.fromEntries((await getWebsiteSlots("home")).filter(({ revision }) => revision > 0)
    .map(({ key, src, alt }) => [key, { src, alt }])));

