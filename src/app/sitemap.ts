import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/site";
import { productCategories } from "@/content/company";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl;
  const staticRoutes = [
    "",
    "/about",
    "/capabilities",
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
