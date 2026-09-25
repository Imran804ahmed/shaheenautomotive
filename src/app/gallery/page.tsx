import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { galleryPhotos } from "@/content/company";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs of sheet metal, hinge and jack components manufactured by Shaheen Automotive for automotive OEMs in Pakistan.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="Gallery"
        intro="Stamped panels, hinge assemblies and jack components from our press, welding and finishing shops."
      />

      <section className="bg-bg py-16">
        <Container>
          <GalleryGrid photos={galleryPhotos} showFilters />
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
