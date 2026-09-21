import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { ClientsStrip } from "@/components/sections/ClientsStrip";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { productCategories, clients } from "@/content/company";

export const metadata: Metadata = {
  title: "Products",
  description:
    "Sheet metal parts, formed pipe parts and bent rod components manufactured by Shaheen Automotive for automotive and home appliance OEMs.",
  alternates: { canonical: "/products" },
};

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Products"
        title="Sheet metal, pipe and rod parts, by category."
        intro="Every category below links to verified component examples manufactured for our OEM customers, alongside the processes used to produce them."
      />
      <ProductsShowcase categories={productCategories} />
      <ClientsStrip clients={clients} />
      <CtaBanner
        heading="Can't find your part category?"
        body="Send us the drawing regardless, most of our work spans more than one process in a single component."
      />
    </>
  );
}
