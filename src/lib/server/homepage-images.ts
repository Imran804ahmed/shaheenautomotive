import { createHash } from "node:crypto";
import { cache } from "react";
import { capabilityPhotos } from "@/content/capability-photos";
import type { Award } from "@/content/company";
import { getContent } from "./content";
import { db, transaction } from "./database.mjs";

export type HomeImage = { src: string; alt: string };
export type HomeImages = Record<string, HomeImage | undefined>;
type Slot = HomeImage & { key: string; section: string; title: string; width: number; height: number; fit: "cover" | "contain" };
type StoredSlot = { image_key: string; original_src: string; original_alt: string; current_version: string | null; current_alt: string | null; revision: number; updated_at: number | null; width: number | null; height: number | null; file_size: number | null };

function stableKey(prefix: string, name: string) {
  return `${prefix}-${createHash("sha256").update(name).digest("hex").slice(0, 24)}`;
}

export const clientImageKey = (name: string) => stableKey("client", name);
export const awardImageKey = (award: Award) => stableKey("award", JSON.stringify([award.title, award.year, award.awardedBy]));
export const uploadedImage = (id: string) => `/home-image/${id}/0/`;

export const homepageInventory = cache(async () => {
  const content = await getContent();
  const { hero, settings, brand, capabilities, capabilityImages, clients, productCategories, productDetails, categoryPhotos, awardPhotos } = content;
  const slots: Slot[] = [];
  function add(key: string, section: string, title: string, src: string, alt: string, width: number, height: number, fit: Slot["fit"] = "cover") {
    slots.push({ key, section, title, src, alt, width, height, fit });
  }
  add("hero-background", "Hero", "Hero background", hero.image, "", 1920, 1080);
  add("hero-poster", "Hero", "Hero video poster", settings.heroVideo.poster, "", 1920, 1080);
  add("header-logo", "Branding", "Header wordmark", brand.logoFull, settings.companyLegalName, 1000, 231, "contain");
  add("footer-logo", "Branding", "Footer wordmark", brand.logoFull, settings.companyLegalName, 1000, 231, "contain");
  add("footer-mark", "Branding", "Footer watermark", brand.markLight, "", 512, 509, "contain");
  for (const client of clients) {
    add(clientImageKey(client.name), "Client logos", client.name, client.logo, client.name, 480, 200, "contain");
  }
  for (const item of capabilities) {
    const custom = capabilityImages.find(({ slug, src }) => slug === item.slug && src);
    const photo = custom ?? capabilityPhotos[item.slug] ?? capabilityPhotos["design-tooling"];
    add(stableKey("capability", item.slug), "Capabilities", item.title, photo.src, photo.alt, 960, 540);
  }
  for (const item of productCategories.filter(({ visible, featured }) => visible && featured)) {
    const custom = productDetails.find(({ slug }) => slug === item.slug)?.photos;
    const photo = (custom?.length ? custom : categoryPhotos[item.slug])?.[0] ??
      (item.heroImage && { src: item.heroImage.src, alt: item.title });
    add(stableKey("product", item.slug), "Featured products", item.title, photo?.src ?? "", photo?.alt ?? "", 1000, 800);
  }
  add("shop-background", "Shop floor", "Shop floor background", "/images/facility/storage/parts-store.webp", "", 1920, 1080);
  add("shop-poster", "Shop floor", "Shop floor video poster", "/images/video/shop-floor-poster.jpg", "", 1280, 720);
  for (const award of awardPhotos.filter(({ featured, image }) => featured && image)) {
    add(awardImageKey(award), "Awards", award.title, award.image!, `${award.title}, ${award.awardedBy}`, 720, 960, "contain");
  }
  return [...new Map(slots.map((slot) => [slot.key, slot])).values()];
});

export const capabilityImageKey = (slug: string) => stableKey("capability", slug);
export const productImageKey = (slug: string) => stableKey("product", slug);

export const getHomepageSlots = cache(async () => {
  const inventory = await homepageInventory();
  const query = db().prepare(`
    SELECT s.*,v.width,v.height,v.file_size FROM homepage_images s
    LEFT JOIN homepage_image_versions v ON v.id=s.current_version AND v.image_key=s.image_key
  `);
  const rows = await query.all() as unknown as StoredSlot[];
  const index = new Map(rows.map((row) => [row.image_key, row]));
  const missing = inventory.filter(({ key }) => !index.has(key));
  if (missing.length) {
    await transaction(async () => {
      const insert = db().prepare(`
        INSERT INTO homepage_images(image_key,original_src,original_alt) VALUES (?,?,?)
        ON DUPLICATE KEY UPDATE image_key=image_key
      `);
      for (const slot of missing) await insert.run(slot.key, slot.src, slot.alt.slice(0, 300));
    });
    for (const row of await query.all() as unknown as StoredSlot[]) index.set(row.image_key, row);
  }
  return inventory.map((slot) => {
    const stored = index.get(slot.key)!;
    const version = stored.width ? stored.current_version : null;
    return {
      ...slot,
      src: version ? uploadedImage(version) : stored.revision ? stored.original_src : slot.src,
      alt: stored.current_alt ?? (stored.revision ? stored.original_alt : slot.alt),
      original: stored.original_src,
      revision: stored.revision,
      updatedAt: stored.updated_at,
      currentVersion: version,
      actualWidth: stored.width,
      actualHeight: stored.height,
      bytes: stored.file_size,
    };
  });
});

export const getHomepageImages = cache(async (): Promise<HomeImages> =>
  Object.fromEntries((await getHomepageSlots()).map(({ key, src, alt }) => [key, { src, alt }])));
