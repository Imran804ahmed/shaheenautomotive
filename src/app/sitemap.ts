import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { BASE_PATH } from "@/lib/base-path";
import { productCategories } from "@/content/company";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = `${siteConfig.baseUrl}${BASE_PATH}`;
  const staticRoutes = [
    "",
    "/about",
    "/manufacturing",
    "/careers",
    "/facility",
    "/products",
    "/quality",
    "/customers",
    "/gallery",
    "/contact",
  ];

  const productRoutes = productCategories.map((c) => `/products/${c.slug}`);

  return [...staticRoutes, ...productRoutes].map((route) => ({
    url: `${base}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
