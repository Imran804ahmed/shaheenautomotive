import type { MetadataRoute } from "next";
import { getContent, pagePaths } from "@/lib/server/content";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { settings, productCategories } = await getContent();
  if (!settings.robotsIndex) return [];
  const products = productCategories.filter(({ visible }) => visible).map(({ slug }) => `/products/${slug}`);
  return [...pagePaths, ...products].map((path) => ({
    url: new URL(path === "/" ? path : `${path}/`, settings.baseUrl).href,
  }));
}
