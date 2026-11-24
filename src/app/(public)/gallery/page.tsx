import { pageMetadata } from "@/lib/server/seo";
import { getContent } from "@/lib/server/content";
import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Container } from "@/components/ui/Container";
import { withBlur } from "@/lib/image-meta";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/gallery", {
  title: "Gallery",
  description:
    "Photographs of Shaheen Automotive's plant in Pakistan: the Press Shop, welding and finishing lines, QA & QC lab and stores.",
  alternates: { canonical: "/gallery" },
});
}

export default async function GalleryPage() {
  const { pageHeaders, galleryPhotos, galleryCategories } = await getContent();
  return (
    <>
      <PageHeader {...pageHeaders.gallery} flat />

      <section className="bg-bg py-16">
        <Container>
          <GalleryGrid categories={galleryCategories} photos={withBlur(galleryPhotos)} />
        </Container>
      </section>
    </>
  );
}
