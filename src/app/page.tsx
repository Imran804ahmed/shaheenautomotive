import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { ClientsStrip } from "@/components/sections/ClientsStrip";
import { CapabilitiesGrid } from "@/components/sections/CapabilitiesGrid";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ShopFloor } from "@/components/sections/ShopFloor";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { QualityEvidence } from "@/components/sections/QualityEvidence";
import {
  heroStats,
  clients,
  capabilities,
  processSteps,
  productCategories,
  awardPhotos,
} from "@/content/company";

export const metadata: Metadata = {
  title: "Jack, Sheet Metal, Rod & Pipe Component Manufacturer in Pakistan",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <StatsBand stats={heroStats} />
      <ClientsStrip clients={clients} />
      <CapabilitiesGrid capabilities={capabilities} />
      <ProcessTimeline steps={processSteps} />
      <ProductsShowcase categories={productCategories} />
      <ShopFloor />
      <QualityEvidence awards={awardPhotos} />
    </>
  );
}
