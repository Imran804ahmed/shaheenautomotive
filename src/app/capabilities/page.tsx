import type { Metadata } from "next";
import { PageHeader } from "@/components/sections/PageHeader";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { CtaBanner } from "@/components/sections/CtaBanner";
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
} from "@phosphor-icons/react/dist/ssr";
import {
  capabilities,
  processSteps,
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
      />

      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((cap, i) => {
              const Icon = icons[cap.slug];
              return (
                <Reveal key={cap.slug} delay={i * 0.05}>
                  <SpotTrack className="h-full">
                    <a
                      href={`#${cap.slug}`}
                      className={cn(
                        "card-lift relative block h-full overflow-hidden rounded-sm border border-border bg-bg-elevated p-6 shadow-soft"
                      )}
                    >
                      {Icon && (
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                          <Icon size={22} weight="regular" />
                        </span>
                      )}
                      <h3 className="mt-4 text-base font-semibold tracking-tight text-fg">{cap.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{cap.body}</p>
                      {cap.note && <p className="mt-2 text-xs italic text-fg-muted">{cap.note}</p>}
                      <span className="spot-glow" aria-hidden="true" />
                    </a>
                  </SpotTrack>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="rounded-[2.5rem] bg-bg-elevated py-6 shadow-soft sm:rounded-[3.5rem] sm:py-10">
        <Container>
          <EquipmentTable
            id="design-tooling"
            title="Design & development"
            intro="Product and process design, and tooling development, run on industry-standard CAD, CAM and forming-simulation software, supported by a dedicated machine shop for jig and die manufacture."
            items={equipmentDesignDev}
          />
          <EquipmentTable
            id="press-shop"
            title="Press shop"
            intro="A fleet of hydraulic, mechanical and pneumatic presses covering a wide tonnage range, for stamping sheet metal parts from prototype through mass production."
            items={equipmentPressShop}
            totalNote={`${pressShopTotal.machines} presses · ${pressShopTotal.tonnageRange}`}
          />
          <EquipmentTable
            id="pipe-shop"
            title="Pipe shop"
            intro="NC and CNC pipe bending machines and hydraulic pipe flaring equipment, producing formed pipe components to automotive tolerances."
            items={equipmentPipeShop}
          />
          <EquipmentTable
            id="welding"
            title="Welding shop"
            intro="CO₂, spot, ARC, gas and induction welding processes, matched to the joining requirements of each customer's component and applicable standards."
            items={equipmentWeldingShop}
            totalNote={`${weldingShopTotal.machines} welding machines across five processes`}
          />
          <EquipmentTable
            id="inspection"
            title="Quality inspection"
            intro="Dimensional inspection using a FARO Arm with laser scanner alongside conventional gauging equipment, applied at sample, trial and production stages."
            items={equipmentInspection}
          />
        </Container>
      </section>

      <ProcessTimeline steps={processSteps} />

      <CtaBanner
        heading="Need a feasibility check on a new part?"
        body="Share your drawing or CAD file and target volume, and we'll confirm which of our processes fit."
      />
    </>
  );
}
