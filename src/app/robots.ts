import type { MetadataRoute } from "next";
import { getContent } from "@/lib/server/content";

export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const { settings } = await getContent();
  return {
    rules: { userAgent: "*", disallow: settings.robotsIndex ? ["/admin/", "/api/"] : "/" },
    sitemap: `${settings.baseUrl}/sitemap.xml`,
  };
}
