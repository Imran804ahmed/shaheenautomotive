import { getPageImages } from "@/lib/server/website-images";
import { pageImageKey, mapGallery, resolvePhoto } from "@/lib/server/website-image-inventory";
import { pageMetadata } from "@/lib/server/seo";
import { getContent } from "@/lib/server/content";
import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { withBlur } from "@/lib/image-meta";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/facility", {
  title: "Inside the Plant",
  description:
    "Photographs of the Shaheen Automotive Press Shop, MIG welding and spot welding lines, and the operators who run them.",
  alternates: { canonical: "/facility" },
});
}

export default async function FacilityPage() {
  const images = await getPageImages("facility");
  const { pageHeaders, floorCategories, floorPhotos } = await getContent();
  return (
    <>
      <PageHeader {...pageHeaders.facility} image={ { ...pageHeaders.facility.image, src: images[pageImageKey("facility", "banner")]?.src || pageHeaders.facility.image.src } } flat />

      <section className="rounded-section bg-bg-elevated pb-section pt-10 shadow-soft sm:pt-14">
        <Container>
          <SectionHeading
            eyebrow="On the floor"
            title="A day in the shop."
            body="Tap any photo to see it full size."
            className="mx-auto mb-12 text-center"
          />
          <GalleryGrid photos={withBlur(mapGallery("facility", floorPhotos, (id, photo) => resolvePhoto(images, id, photo)))} categories={floorCategories} showFilters />
        </Container>
      </section>
    </>
  );
}
