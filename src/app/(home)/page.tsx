import { getHomepageImages } from "@/lib/server/homepage-images";
import { Fragment } from "react";
import { pageMetadata } from "@/lib/server/seo";
import { getContent } from "@/lib/server/content";
import type { Metadata } from "next";
import { Hero } from "@/components/sections/Hero";
import { StatsBand } from "@/components/sections/StatsBand";
import { ClientsStrip } from "@/components/sections/ClientsStrip";
import { CapabilitiesGrid } from "@/components/sections/CapabilitiesGrid";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { ShopFloor } from "@/components/sections/ShopFloor";
import { ProductsShowcase } from "@/components/sections/ProductsShowcase";
import { QualityEvidence } from "@/components/sections/QualityEvidence";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/", {
  title: "Jack, Sheet Metal, Rod & Pipe Component Manufacturer in Pakistan",
  alternates: { canonical: "/" },
});
}

export default async function Home() {
  const { heroStats, clients, capabilities, processSteps, productCategories, awardPhotos, homeSections } = await getContent();
  const images = await getHomepageImages();
  const sections: Record<string, React.ReactNode> = {
    Stats: <StatsBand stats={heroStats} />,
    Clients: <ClientsStrip clients={clients} images={images} />,
    Capabilities: <CapabilitiesGrid capabilities={capabilities} images={images} />,
    Process: <ProcessTimeline steps={processSteps} />,
    Products: <ProductsShowcase categories={productCategories.filter(({ visible, featured }) => visible && featured)} images={images} />,
    "Shop Floor": <ShopFloor images={images} />,
    Awards: <QualityEvidence awards={awardPhotos} images={images} />,
  };
  return (
    <>
      <Hero images={images} />
      {homeSections.filter(({ visible }) => visible).map(({ name }) => <Fragment key={name}>{sections[name]}</Fragment>)}
    </>
  );
}
