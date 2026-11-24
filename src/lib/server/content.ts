import { cache } from "react";
import pageHeaders from "@/content/page-headers.json";
import * as company from "@/content/company";
import { siteConfig } from "@/content/site";
import { db, transaction } from "./database.mjs";

export const pagePaths = ["/", "/about", "/capabilities", "/facility", "/products", "/quality", "/csr", "/gallery", "/contact"] as const;
const galleryCategories = company.galleryCategories;

export const defaults = {
  ...company,
  capabilityVisibility: company.capabilities.map(({ slug }) => ({ slug, visible: true })),
  productCategories: company.productCategories.map((item) => ({ ...item, visible: true, featured: true })),
  homeCapabilityOrder: ["press-shop", "inspection", "pipe-shop", "welding", "design-tooling", "surface-finishing"],
  galleryCategories,
  capabilityImages: company.capabilities.map(({ slug }) => ({ slug, src: "", alt: "" })),
  productDetails: company.productCategories.map(({ slug }) => ({ slug, specifications: "", photos: [] as company.ProductPhoto[] })),
  pageHeaders,
  settings: {
    companyLegalName: siteConfig.companyLegalName,
    siteName: siteConfig.siteName,
    baseUrl: siteConfig.baseUrl,
    contact: siteConfig.contact,
    social: siteConfig.social,
    heroVideo: siteConfig.heroVideo,
    nav: siteConfig.nav,
    footerHeadline: "Engineering excellence.",
    footerHighlight: "Driving the future.",
    footerAction: "Start a project",
    footerActionHref: "/contact",
    footerDescription: "Shaheen Automotive (Pvt.) Ltd. designs and manufactures jack assemblies, sheet metal, bent rod and formed pipe components for the automotive and home appliance industries.",
    businessHours: "Monday – Saturday, business hours (Pakistan Standard Time)",
    copyright: "All rights reserved.",
    robotsIndex: true,
  },
  hero: {
    title: "Engineering the Parts That Move Pakistan’s Automotive Industry.",
    eyebrow: "Manufacturing in Pakistan since 1983",
    description: "Precision-engineered automotive components, pioneering metal-forming expertise, and dependable OEM manufacturing — built on decades of industry experience.",
    image: "/images/facility/exterior/sapl-plant-front.jpg",
    primaryLabel: "Contact Us",
    primaryHref: "/contact",
    secondaryLabel: "Explore Capabilities",
    secondaryHref: "/capabilities",
  },
  homeSections: ["Stats", "Clients", "Capabilities", "Process", "Products", "Shop Floor", "Awards"]
    .map((name) => ({ name, visible: true })),
  seo: [...pagePaths, ...company.productCategories.map(({ slug }) => `/products/${slug}`)]
    .map((path) => ({ path, title: "", description: "", canonical: "", image: "" })),
};

export type Content = typeof defaults;
export type ContentKey = keyof Content;

export function isContentKey(key: string): key is ContentKey {
  return Object.hasOwn(defaults, key);
}

export const getContent = cache(async (): Promise<Content> => {
  const rows = await dataRows();
  return Object.fromEntries(rows.map((row) => [row.section_key, JSON.parse(String(row.published))])) as Content;
});

let seeded = false;
export async function dataRows() {
  if (!seeded) {
    await transaction(async () => {
      const insert = db().prepare("INSERT INTO cms(cms_key,published) VALUES (?,?) ON DUPLICATE KEY UPDATE cms_key=cms_key");
      for (const [key, value] of Object.entries(defaults)) await insert.run(key, JSON.stringify(value));
    });
    seeded = true;
  }
  return (await db().prepare("SELECT cms_key AS section_key,published FROM cms").all()).filter((row) => isContentKey(String(row.section_key)));
}

function validLink(value: string) {
  return /^\/(?!\/)[a-z0-9/_?&=.%#-]*$/i.test(value) || /^https:\/\/[^\s\\<>"']+$/i.test(value);
}

function matchesSchema(value: unknown, sample: unknown, field: string): boolean {
  if (Array.isArray(sample)) {
    return Array.isArray(value) && value.length <= 300 &&
      value.every((item) => (sample.length ? sample : field === "photos" ? [{ src: "/images/example.webp", alt: "" }] : []).some((example) => matchesSchema(item, example, field)));
  }
  if (sample && typeof sample === "object") {
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const shape = sample as Record<string, unknown>;
    const record = value as Record<string, unknown>;
    return Object.keys(record).every((key) => Object.hasOwn(shape, key)) &&
      Object.entries(shape).every(([key, example]) => matchesSchema(record[key], example, key));
  }
  if (typeof sample !== typeof value) return false;
  if (typeof value !== "string") return typeof value !== "number" || Number.isFinite(value);
  if (value.length > 6000) return false;
  if (["src", "image", "heroImage", "logo", "logoFull", "logoFullLight", "mark", "markLight", "photo", "poster", "href", "primaryHref", "secondaryHref", "footerActionHref", "mapEmbedUrl", "mapLinkUrl", "linkedin", "whatsapp", "canonical"].includes(field)) {
    return (!value && !sample) || validLink(value);
  }
  if (field === "phoneHref") return /^tel:\+?[0-9]{5,18}$/.test(value);
  if (field === "baseUrl") return /^https:\/\/[a-z0-9.-]+$/i.test(value);
  if (field === "email") return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (field === "slug") return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
  return true;
}

export function validatedContent(key: ContentKey, raw: string) {
  const value: unknown = JSON.parse(raw);
  if (!matchesSchema(value, defaults[key], key)) throw new Error("Check the field types, links, and required values.");
  if (Array.isArray(value)) {
    for (const field of ["slug", "path", "key", ...(key === "homeSections" ? ["name"] : [])]) {
      const identifiers = value.flatMap((item) => item && typeof item === "object" && field in item ? [item[field]] : []);
      if (new Set(identifiers).size !== identifiers.length) throw new Error(`Duplicate ${field}.`);
    }
  }
  if (key === "homeSections" || key === "seo") {
    const property = key === "homeSections" ? "name" : "path";
    const allowed = new Set(defaults[key].map((item) => (item as unknown as Record<string, string>)[property]));
    if ((value as Record<string, string>[]).some((item) => !allowed.has(item[property]) && !(key === "seo" && /^\/products\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.path)))) throw new Error("Unknown section or page.");
  }
  if (key === "productCategories") {
    const slugs = new Set((value as Content["productCategories"]).map(({ slug }) => slug));
    if (company.productCategories.some(({ slug }) => !slugs.has(slug))) {
      throw new Error("Keep existing product URLs. Use visibility to remove a family from listings.");
    }
  }
  return JSON.stringify(value);
}
