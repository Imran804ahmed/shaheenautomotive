import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { equipmentPressShop, floorAreas, floorCategories, floorPhotos } from "@/content/company";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Inside the Plant",
  description:
    "Photographs of the Shaheen Automotive press shop, MIG welding and spot welding lines, and the operators who run them.",
  alternates: { canonical: "/facility" },
};

export default function FacilityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Facility"
        title="Inside the plant"
        intro="Our press shop, welding bays and spot welding lines, and the operators who run them every shift."
      />

      <section className="surface-paper bg-bg py-20 sm:py-28">
        <Container className="space-y-16 sm:space-y-24 lg:space-y-28">
          {floorAreas.map((area, i) => (
            <div key={area.key} id={area.key} className="grid scroll-mt-28 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal from={i % 2 ? "right" : "left"} className={cn(i % 2 && "lg:order-2")}>
                <ParallaxImage
                  src={area.cover}
                  alt={area.coverAlt}
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="aspect-[4/3] rounded-[2rem] shadow-lift ring-1 ring-border"
                />
              </Reveal>

              <Reveal delay={0.08}>
                <p className="mono-figure text-4xl font-semibold text-accent/25 sm:text-6xl">{area.number}</p>
                <h2 className="mt-3 text-display-md font-semibold tracking-tight text-fg">{area.label}</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">{area.body}</p>

                {area.key === "press-shop" && (
                  <dl className="mt-8 grid max-w-md grid-cols-3 gap-2 sm:gap-3">
                    {equipmentPressShop.map((e) => (
                      <div key={e.name} className="min-w-0 rounded-2xl border border-border bg-bg-elevated p-3 shadow-soft sm:p-4">
                        <dt className="text-[11px] leading-snug text-fg-muted hyphens-auto sm:text-xs">{e.name}</dt>
                        <dd className="mono-figure mt-2 text-2xl font-semibold text-fg">{e.qty}</dd>
                        {e.detail && <dd className="mt-0.5 text-[11px] text-fg-muted">{e.detail}</dd>}
                      </div>
                    ))}
                  </dl>
                )}
              </Reveal>
            </div>
          ))}
        </Container>
      </section>

      <section className="rounded-[2.5rem] bg-bg-elevated py-20 shadow-soft sm:rounded-[3.5rem] sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="On the floor"
            title="A day in the shop."
            body="Tap any photo to see it full size."
            className="mx-auto mb-12 text-center"
          />
          <GalleryGrid photos={floorPhotos} categories={floorCategories} showFilters />
        </Container>
      </section>

      <CtaBanner />
    </>
  );
}
