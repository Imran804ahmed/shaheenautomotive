import { getPageImages } from "./website-images";
import { pageImageKey } from "./website-image-inventory";
import type { Metadata } from "next";
import { getContent } from "./content";

export async function pageMetadata(path: string, baseline: Metadata): Promise<Metadata> {
  const { seo, settings } = await getContent();
  const entry = seo.find((item) => item.path === path);
  const pageKey = path === "/" ? "home" : path.slice(1).replace(/^products\//, "product-");
  const images = await getPageImages(pageKey);
  const sharingImage = images[pageImageKey(pageKey, "sharing")]?.src || entry?.image;
  const title = entry?.title || (typeof baseline.title === "string" ? baseline.title : undefined);
  const description = entry?.description || baseline.description;
  return {
    ...baseline,
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: { ...baseline.alternates, canonical: entry?.canonical || baseline.alternates?.canonical || path },
    robots: settings.robotsIndex ? baseline.robots : { index: false, follow: false },
    ...(sharingImage || entry?.title || entry?.description ? {
      openGraph: { title, description: description ?? undefined, images: sharingImage ? [sharingImage] : undefined },
      twitter: { card: "summary_large_image", title, description: description ?? undefined, images: sharingImage ? [sharingImage] : undefined },
    } : {}),
  };
}
