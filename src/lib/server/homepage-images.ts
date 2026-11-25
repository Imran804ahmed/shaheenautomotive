import { createHash } from "node:crypto";
import { cache } from "react";
import { capabilityPhotos } from "@/content/capability-photos";
import type { Award } from "@/content/company";
import { getContent } from "./content";

export type HomeImage = { src: string; alt: string };
export type HomeImages = Record<string, HomeImage | undefined>;
export type Slot = HomeImage & { key: string; section: string; title: string; width: number; height: number; fit: "cover" | "contain" };

export function stableKey(prefix: string, name: string) {
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
