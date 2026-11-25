import { cache } from "react";
import { productPhotos } from "@/content/capability-page-photos";
import { qualityStages } from "@/content/quality-stages";
import type { Award } from "@/content/company";
import { getContent } from "./content";
import { homepageInventory, stableKey, type HomeImage, type Slot } from "./homepage-images";

export const aboutPress = {
  src: "/images/facility/floor/komatsu-200-press.jpg",
  alt: "Komatsu 200-tonne straight-side power press, P.P. 53, on the SAPL press shop floor",
};

export const defaultSharingImage = "/images/facility/hydraulic-press-operator.jpeg";
export const galleryImageKey = (page: string, src: string, occurrence = 0) => stableKey(page, JSON.stringify([src, occurrence]));
export const qualityAwardKey = (award: Award) => stableKey("quality-award", JSON.stringify([award.title, award.year, award.awardedBy]));
export const globalClientKey = (name: string) => stableKey("global-client", name);
export const pageImageKey = (page: string, name: string) => stableKey(page, name);

type WebsitePage = { key: string; title: string; path: string; slots: Slot[] };

const pages = [
  ["about", "About Us"], ["capabilities", "Capabilities"], ["facility", "Inside the Plant"],
  ["products", "Products"], ["quality", "Quality"], ["csr", "Corporate Social Responsibility"],
  ["gallery", "Gallery"], ["contact", "Contact Us"],
] as const;

export function imageManagementHref(key: string) {
  return key === "home" ? "/admin/homepage/images" : `/admin/website/images/${key}`;
}

export const getImageManagementPages = cache(async () => {
  const { productCategories } = await getContent();
  return {
    main: [
      { key: "home", title: "Home Page" },
      ...pages.map(([key, title]) => ({ key, title })),
    ],
    products: productCategories.map(({ slug, title }) => ({ key: `product-${slug}`, title })),
  };
});

export function productDetailPhotos(content: Awaited<ReturnType<typeof getContent>>, slug: string) {
  const custom = content.productDetails.find((item) => item.slug === slug)?.photos;
  if (slug === "jack-assemblies" && !custom?.length) return { photos: content.jackHingePhotos, grouped: true } as const;
  const original = Object.entries(content.categoryPhotos).find(([key]) => key === slug)?.[1];
  return { photos: custom?.length ? custom : original ?? [], grouped: false } as const;
}

export function mapGallery<T extends { src: string; alt: string }>(page: string, photos: T[], map: (key: string, photo: T) => T) {
  const occurrences = new Map<string, number>();
  return photos.map((photo) => {
    const occurrence = occurrences.get(photo.src) ?? 0;
    occurrences.set(photo.src, occurrence + 1);
    return map(galleryImageKey(page, photo.src, occurrence), photo);
  });
}

export function resolvePhoto<T extends HomeImage>(images: Record<string, HomeImage | undefined>, key: string, photo: T): T {
  return images[key]?.src ? { ...photo, ...images[key] } : photo;
}

export const getWebsiteInventory = cache(async (requestedPage?: string): Promise<WebsitePage[]> => {
  const content = await getContent();
  const include = (key: string) => !requestedPage || requestedPage === key;
  const inventory: WebsitePage[] = include("home")
    ? [{ key: "home", title: "Home Page", path: "/", slots: [...await homepageInventory()] }]
    : [];
  const addPage = (key: string, title: string, path: string) => {
    const slots: Slot[] = [];
    inventory.push({ key, title, path, slots });
    const add = (id: string, section: string, title: string, photo: HomeImage, width: number, height: number, fit: Slot["fit"] = "cover") => {
      slots.push({ key: id, section, title, ...photo, width, height, fit });
    };
    const banner = (src: string) => add(pageImageKey(key, "banner"), "Banner", "Page banner", { src, alt: "" }, 1920, 800);
    const gallery = (photos: {src: string; alt: string; caption?: string}[], section: string, width = 1200, height = 900) => {
      mapGallery(key, photos, (id, photo) => {
        add(id, section, photo.caption || photo.alt || "Photograph", { src: photo.src, alt: photo.alt }, width, height);
        return photo;
      });
    };
    return { add, banner, gallery };
  };

  for (const [key, title] of pages) {
    if (!include(key)) continue;
    const { add, banner, gallery } = addPage(key, title, `/${key}/`);
    banner(content.pageHeaders[key].image.src);
    if (key === "about") {
      add(pageImageKey(key, "press"), "Company", "Press shop", aboutPress, 1200, 900);
      for (const member of [...content.leadership, ...content.managementTeam]) {
        add(pageImageKey(key, member.slug), "Leadership & management", member.name, { src: member.photo ?? "", alt: member.photoAlt }, 720, 900);
      }
    } else if (key === "capabilities") {
      for (const item of content.capabilities) {
        const photo = content.capabilityImages.find(({ slug, src }) => slug === item.slug && src) ?? productPhotos[item.slug];
        add(pageImageKey(key, item.slug), "Capability cards", item.title, photo ?? { src: "", alt: "" }, 1200, 900);
      }
    } else if (key === "facility") {
      gallery(content.floorPhotos, "Facility gallery");
    } else if (key === "products") {
      for (const item of content.productCategories) {
        const custom = content.productDetails.find(({ slug }) => slug === item.slug)?.photos;
        const photo = (custom?.length ? custom : content.categoryPhotos[item.slug])?.[0] ??
          (item.heroImage && { src: item.heroImage.src, alt: item.title });
        add(pageImageKey(key, item.slug), "Product covers", item.title, photo ?? { src: "", alt: "" }, 1000, 800);
      }
      gallery(content.productGalleryPhotos, "Product gallery");
    } else if (key === "quality") {
      for (const stage of qualityStages) add(pageImageKey(key, stage.key), "Production stages", stage.label, { src: stage.cover, alt: stage.coverAlt }, 1200, 900);
      for (const award of content.awardPhotos.filter(({ image }) => image)) {
        add(qualityAwardKey(award), "Awards & certificates", award.title, { src: award.image!, alt: `${award.title}, ${award.awardedBy}` }, 720, 960, "contain");
      }
    } else if (key === "csr") {
      for (const area of content.csrAreas) add(pageImageKey(key, area.key), "CSR initiatives", area.label, { src: area.image, alt: area.imageAlt }, 1200, 900, area.fit);
    } else if (key === "gallery") {
      gallery(content.galleryPhotos, "Plant gallery");
    }
  }
  for (const item of content.productCategories) {
    const key = `product-${item.slug}`;
    if (!include(key)) continue;
    const { banner, gallery } = addPage(key, item.title, `/products/${item.slug}/`);
    banner(item.heroImage?.src ?? "");
    gallery(productDetailPhotos(content, item.slug).photos, "Product detail gallery");
  }
  if (include("global")) {
    const { add } = addPage("global", "Global Images", "/");
    const { brand, settings } = content;
    add("global-header-logo", "Branding", "Header wordmark", { src: brand.logoFull, alt: settings.companyLegalName }, 1000, 231, "contain");
    add("global-footer-logo", "Branding", "Footer wordmark", { src: brand.logoFull, alt: settings.companyLegalName }, 1000, 231, "contain");
    add("global-footer-mark", "Branding", "Footer watermark", { src: brand.markLight, alt: "" }, 512, 509, "contain");
    add("global-favicon", "Branding", "Favicon and Apple touch icon", { src: brand.mark, alt: "" }, 192, 192, "contain");
    add("global-sharing", "Social sharing", "Default sharing image", { src: defaultSharingImage, alt: "" }, 1200, 630);
    for (const client of content.clients) add(globalClientKey(client.name), "Shared client logos", client.name, { src: client.logo, alt: client.name }, 480, 200, "contain");
  }

  for (const entry of inventory.filter(({ key }) => key !== "global")) {
    const path = entry.path === "/" ? "/" : entry.path.slice(0, -1);
    const src = content.seo.find((item) => item.path === path)?.image ?? "";
    entry.slots.push({ key: pageImageKey(entry.key, "sharing"), section: "Social sharing", title: "Page sharing image",
      src, alt: "", width: 1200, height: 630, fit: "cover" });
  }
  return inventory;
});
