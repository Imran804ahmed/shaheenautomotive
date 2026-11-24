import { pageMetadata } from "@/lib/server/seo";
import { getContent } from "@/lib/server/content";
import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { ClientsStrip } from "@/components/sections/ClientsStrip";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { Container } from "@/components/ui/Container";
import { withBlur } from "@/lib/image-meta";
import { SectionHeading } from "@/components/ui/SectionHeading";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/products", {
  title: "Products",
  description:
    "Jack assemblies, sheet metal parts, bent rod parts and formed pipe components manufactured by Shaheen Automotive for automotive and home appliance OEMs.",
  alternates: { canonical: "/products" },
});
}

export default async function ProductsPage() {
  const { pageHeaders, productCategories, clients, productGalleryCategories, productGalleryPhotos } = await getContent();
  const hiddenSlugs = new Set(productCategories.filter(({ visible }) => !visible).map(({ slug }) => String(slug)));
  return (
    <>
      <PageHeader {...pageHeaders.products} flat />
      <ProductsShowcase categories={productCategories.filter(({ visible }) => visible)} />

      <section className="bg-bg pb-section">
        <Container>
          <SectionHeading
            eyebrow="Product gallery"
            title="Browse parts by product family."
            body="Filter by family to see stamped, formed and assembled parts made on our lines."
            className="mx-auto mb-10 text-center"
          />
          <GalleryGrid photos={withBlur(productGalleryPhotos.filter(({ category }) => !hiddenSlugs.has(category)))} categories={productGalleryCategories.filter(({ key }) => !hiddenSlugs.has(key))} showFilters />
        </Container>
      </section>
      <ClientsStrip clients={clients} />
    </>
  );
}
