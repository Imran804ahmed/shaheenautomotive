import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { ClientsStrip } from "@/components/sections/ClientsStrip";
import { CapabilitiesGrid } from "@/components/sections/CapabilitiesGrid";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ShopFloor } from "@/components/sections/ShopFloor";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { QualityEvidence } from "@/components/sections/QualityEvidence";
import { GalleryPreview } from "@/components/sections/GalleryPreview";
import { CtaBanner } from "@/components/sections/CtaBanner";
import {
  heroStats,
  clients,
  capabilities,
  processSteps,
  productCategories,
  awardPhotos,
  galleryPhotos,
  floorAreas,
} from "@/content/company";

export const metadata: Metadata = {
  title: "Sheet Metal, Pipe & Rod Component Manufacturer in Pakistan",
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
      <GalleryPreview photos={galleryPhotos.slice(0, 8)} />
      <ProductsShowcase categories={productCategories} />
      <ShopFloor areas={floorAreas} />
      <QualityEvidence awards={awardPhotos.slice(0, 5)} />
      <CtaBanner />
    </>
  );
}
