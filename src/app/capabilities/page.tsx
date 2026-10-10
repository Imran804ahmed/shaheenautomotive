import type { Metadata } from "next";
import Image from "next/image";
import { blurProps } from "@/lib/image-meta";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SpotTrack } from "@/components/ui/SpotTrack";
import {
  Wrench,
  Cube,
  FlowArrow,
  Fire,
  Drop,
  Crosshair,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import {
  capabilities,
  equipmentDesignDev,
  equipmentPressShop,
  equipmentPipeShop,
  equipmentWeldingShop,
  equipmentInspection,
  pressShopTotal,
  weldingShopTotal,
} from "@/content/company";
import type { Equipment } from "@/content/company";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Capabilities",
  description:
    "Design and tooling, sheet metal stamping, pipe bending, welding, surface finishing and dimensional inspection at Shaheen Automotive.",
  alternates: { canonical: "/capabilities" },
};

const icons: Record<
  string,
  React.ComponentType<{ size?: number; weight?: "regular" | "bold"; className?: string }>
> = {
  "design-tooling": Wrench,
  "press-shop": Cube,
  "pipe-shop": FlowArrow,
  welding: Fire,
  "surface-finishing": Drop,
  inspection: Crosshair,
};

const equipmentSections = new Set(["design-tooling", "press-shop", "pipe-shop", "welding", "inspection"]);

// the same shop-floor photo each capability uses on the home page
const productPhotos: Record<string, { src: string; alt: string; position?: string }> = {
  "design-tooling": {
    src: "/images/facility/floor/checking-fixture.jpg",
    alt: "Inspector clamping a stamped sheet metal panel into a checking fixture",
  },
  "press-shop": {
    src: "/images/facility/floor/press-line-safety-gear.jpg",
    alt: "Operators in hard hats, safety glasses and high-visibility vests running a line of mechanical power presses",
  },
  "pipe-shop": {
    src: "/images/facility/floor/cnc-pipe-bender-operator.jpg",
    alt: "Operator in a green cap and gloves loading a steel tube into a CNC pipe bending machine",
    position: "50% 40%",
  },
  welding: {
    src: "/images/facility/floor/mig-welding-pipe-assembly.jpg",
    alt: "Welder in a hi-vis vest and welding helmet MIG welding a pipe assembly on a bench fixture, sparks flying",
    position: "50% 31%",
  },
  "surface-finishing": {
    src: "/images/facility/floor/surface-activation-tank-front-v2.jpg",
    alt: "Motor-driven perforated barrels in a Shaheen surface activation tank, with racks of pipe parts in the foreground",
    position: "50% 32%",
  },
  inspection: {
    src: "/images/facility/floor/faro-arm-inspection.jpg",
    alt: "Inspector in a Shaheen Automotive shirt measuring a checking fixture with a FARO Platinum Arm probe",
    position: "50% 64%",
  },
};

function EquipmentTable({
  id,
  title,
  intro,
  items,
  totalNote,
}: {
  id: string;
  title: string;
  intro: string;
  items: Equipment[];
  totalNote?: string;
}) {
  const Icon = icons[id];
  return (
    <div className="scroll-mt-24 border-t border-border py-14 first:border-t-0 first:pt-0" id={id}>
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <Reveal>
          <div className="lg:sticky lg:top-24">
            {Icon && (
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                <Icon size={24} weight="regular" />
              </span>
            )}
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{title}</h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-fg-muted">{intro}</p>
            {totalNote && (
              <p className="mono-figure mt-4 text-sm text-accent">{totalNote}</p>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div className="divide-y divide-border rounded-sm border border-border bg-bg shadow-soft">
            {items.map((item) => (
              <div
                key={item.name}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-5 py-4"
              >
                <span className="text-sm font-medium text-fg">{item.name}</span>
                <span className="flex items-center gap-3 text-sm text-fg-muted">
                  {item.qty && <span className="mono-figure text-accent">&times;{item.qty}</span>}
                  {item.detail && <span>{item.detail}</span>}
                </span>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}

export default function CapabilitiesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Capabilities"
        title="Six capabilities, one production line."
        intro="From design and tooling through sheet metal stamping, pipe bending, welding, surface finishing and dimensional inspection, SAPL runs the full development-to-production chain in-house."
        image={{
          src: "/images/facility/floor/press-operators-hard-hats.jpg",
          position: "70% center",
        }}
        flat
      />

      <section className="surface-paper bg-bg py-section-sm">
        <Container>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {capabilities.map((cap, i) => {
              const Icon = icons[cap.slug];
              const photo = productPhotos[cap.slug];
              // only these capabilities have an equipment section further down the page
              const linked = equipmentSections.has(cap.slug);
              const Card = linked ? "a" : "div";
              return (
                <Reveal key={cap.slug} delay={i * 0.05} className="h-full">
                  <SpotTrack className="h-full">
                    <Card
                      {...(linked ? { href: `#${cap.slug}` } : {})}
                      className={cn(
                        "card-lift group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-bg-elevated p-2 shadow-soft outline-none",
                        linked && "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                      )}
                    >
                      {photo && (
                        <div className="relative aspect-[4/3] overflow-hidden rounded-[1.35rem] bg-[#f1f2f3]">
                          <Image
                            src={photo.src}
                            alt={photo.alt}
                            fill
                            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                            {...blurProps(photo.src)}
                            style={photo.position ? { objectPosition: photo.position } : undefined}
                            className="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06] motion-reduce:transition-none"
                          />
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
                          />
                          <span className="mono-figure absolute left-3 top-3 rounded-full border border-black/5 bg-white/85 px-2.5 py-1 text-[11px] font-semibold text-fg shadow-soft backdrop-blur-md">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>
                      )}

                      <div className="relative flex flex-1 flex-col px-4 pb-5 pt-9 sm:px-5">
                        {/* icon chip straddles the photo's bottom edge */}
                        {Icon && (
                          <span className="absolute -top-6 left-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-white text-accent shadow-soft transition-colors duration-300 group-hover:border-transparent group-hover:bg-accent group-hover:text-accent-fg sm:left-5">
                            <Icon size={22} weight="regular" />
                          </span>
                        )}
                        <h3 className="font-display text-lg font-semibold leading-snug tracking-tight text-fg transition-colors duration-200 group-hover:text-accent-strong sm:text-xl">
                          {cap.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{cap.body}</p>
                        {cap.note && <p className="mt-2 text-xs italic text-fg-muted">{cap.note}</p>}

                        {linked && (
                          <span className="mt-auto flex items-center justify-between border-t border-border pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                            View equipment
                            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-soft text-accent-strong transition-[transform,background-color,color] duration-300 group-hover:translate-x-0.5 group-hover:bg-accent group-hover:text-accent-fg motion-reduce:transition-none">
                              <ArrowRight size={14} weight="bold" />
                            </span>
                          </span>
                        )}
                      </div>

                      <span
                        aria-hidden="true"
                        className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-accent transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:scale-x-100 motion-reduce:transition-none"
                      />
                      <span className="spot-glow" aria-hidden="true" />
                    </Card>
                  </SpotTrack>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="border-y border-border bg-bg-elevated py-6 sm:py-10">
        <Container>
          <EquipmentTable
            id="design-tooling"
            title="Design & Development"
            intro="Product and process design, and tooling development, run on industry-standard CAD, CAM and forming-simulation software, supported by a dedicated machine shop for jig and die manufacture."
            items={equipmentDesignDev}
          />
          <EquipmentTable
            id="press-shop"
            title="Press Shop"
            intro="A fleet of hydraulic, mechanical and pneumatic presses covering a wide tonnage range, for stamping sheet metal parts from prototype through mass production."
            items={equipmentPressShop}
            totalNote={`${pressShopTotal.machines} presses · ${pressShopTotal.tonnageRange}`}
          />
          <EquipmentTable
            id="pipe-shop"
            title="Pipe Shop"
            intro="NC and CNC pipe bending machines and hydraulic pipe flaring equipment, producing formed pipe components to automotive tolerances."
            items={equipmentPipeShop}
          />
          <EquipmentTable
            id="welding"
            title="Welding Shop"
            intro="CO₂, spot, ARC, gas and induction welding processes, matched to the joining requirements of each customer's component and applicable standards."
            items={equipmentWeldingShop}
            totalNote={`${weldingShopTotal.machines} welding machines across five processes`}
          />
          <EquipmentTable
            id="inspection"
            title="Quality Inspection"
            intro="Dimensional inspection using a FARO Arm with laser scanner alongside conventional gauging equipment, applied at sample, trial and production stages."
            items={equipmentInspection}
          />
        </Container>
      </section>
    </>
  );
}
