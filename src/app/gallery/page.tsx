import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Container } from "@/components/ui/Container";
import { galleryPhotos } from "@/content/company";
import { withBlur } from "@/lib/image-meta";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs of Shaheen Automotive's plant in Pakistan: the Press Shop, welding and finishing lines, QA & QC lab and stores.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Gallery"
        title="A look inside our plant."
        intro="The Press Shop, welding and finishing lines, QA & QC lab and stores where every Shaheen Automotive part is made."
        image={{
          src: "/images/facility/floor/press-shop-hall.jpg",
          position: "center 55%",
        }}
        flat
      />

      <section className="bg-bg py-16">
        <Container>
          <GalleryGrid photos={withBlur(galleryPhotos)} />
        </Container>
      </section>
    </>
  );
}
