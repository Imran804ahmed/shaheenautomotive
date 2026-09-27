import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { ClientsStrip } from "@/components/sections/ClientsStrip";
import { CompanyProfile } from "@/components/sections/CompanyProfile";
import { ManufacturingShowcase } from "@/components/sections/ManufacturingShowcase";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { QualitySection } from "@/components/sections/QualitySection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { clients, productCategories, awardPhotos } from "@/content/company";

export const metadata: Metadata = {
  title: "Sheet Metal, Pipe & Rod Component Manufacturer in Pakistan",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <ClientsStrip clients={clients} />
      <CompanyProfile />
      <ManufacturingShowcase />
      <ProductsShowcase categories={productCategories} />
      <QualitySection awards={awardPhotos} />
      <CtaBanner />
    </>
  );
}
