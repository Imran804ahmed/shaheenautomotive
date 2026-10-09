import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { ClientsStrip } from "@/components/sections/ClientsStrip";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Container } from "@/components/ui/Container";
import { withBlur } from "@/lib/image-meta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import {
  productCategories,
  clients,
  productGalleryCategories,
  productGalleryPhotos,
} from "@/content/company";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Jack assemblies, sheet metal parts, bent rod parts and formed pipe components manufactured by Shaheen Automotive for automotive and home appliance OEMs.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Jack and Hinges, Sheet Metal, Rods and Pipes"
        intro="Every category below links to verified component examples manufactured for our OEM customers, alongside the processes used to produce them."
        image={{
          src: "/images/products/hero/bent-rods-bin.webp",
          position: "60% center",
        }}
        flat
      />
      <ProductsShowcase categories={productCategories} />

      <section className="bg-bg pb-section">
        <Container>
          <SectionHeading
            eyebrow="Product gallery"
            title="Browse parts by product family."
            body="Filter by family to see stamped, formed and assembled parts made on our lines."
            className="mx-auto mb-10 text-center"
          />
          <GalleryGrid photos={withBlur(productGalleryPhotos)} categories={productGalleryCategories} showFilters />
        </Container>
      </section>
      <ClientsStrip clients={clients} />
    </>
  );
}
