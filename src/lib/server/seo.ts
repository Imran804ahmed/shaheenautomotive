import type { Metadata } from "next";
import { getContent } from "./content";

export async function pageMetadata(path: string, baseline: Metadata): Promise<Metadata> {
  const { seo, settings } = await getContent();
  const entry = seo.find((item) => item.path === path);
  const title = entry?.title || (typeof baseline.title === "string" ? baseline.title : undefined);
  const description = entry?.description || baseline.description;
  return {
    ...baseline,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { ...baseline.alternates, canonical: entry?.canonical || baseline.alternates?.canonical || path },
    robots: settings.robotsIndex ? baseline.robots : { index: false, follow: false },
    ...(entry?.image || entry?.title || entry?.description ? {
      openGraph: { title, description: description ?? undefined, images: entry.image ? [entry.image] : undefined },
      twitter: { card: "summary_large_image", title, description: description ?? undefined, images: entry.image ? [entry.image] : undefined },
    } : {}),
  };
}
