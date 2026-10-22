import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { floorCategories, floorPhotos } from "@/content/company";
import { withBlur } from "@/lib/image-meta";

export const metadata: Metadata = {
  title: "Inside the Plant",
  description:
    "Photographs of the Shaheen Automotive Press Shop, MIG welding and spot welding lines, and the operators who run them.",
  alternates: { canonical: "/facility" },
};

export default function FacilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Facility"
        title="Inside the plant"
        intro="Our Press Shop, welding bays and spot welding lines, and the operators who run them every shift."
        image={{
          src: "/images/facility/floor/enhanced/press-shop-hall.jpg",
          position: "60% 65%",
        }}
        flat
      />

      <section className="rounded-section bg-bg-elevated pb-section pt-10 shadow-soft sm:pt-14">
        <Container>
          <SectionHeading
            eyebrow="On the floor"
            title="A day in the shop."
            body="Tap any photo to see it full size."
            className="mx-auto mb-12 text-center"
          />
          <GalleryGrid photos={withBlur(floorPhotos)} categories={floorCategories} showFilters />
        </Container>
      </section>
    </>
  );
}
