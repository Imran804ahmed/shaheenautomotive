import Link from "next/link";
import Image from "next/image";
import { blurProps } from "@/lib/image-meta";
import {
  Wrench,
  Cube,
  FlowArrow,
  Fire,
  Drop,
  Crosshair,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotTrack } from "@/components/ui/SpotTrack";
import type { Capability } from "@/content/company";

const icons: Record<string, React.ComponentType<{ size?: number; weight?: "regular" | "bold" }>> = {
  "design-tooling": Wrench,
  "press-shop": Cube,
  "pipe-shop": FlowArrow,
  welding: Fire,
  "surface-finishing": Drop,
  inspection: Crosshair,
};

const anchored = new Set(["design-tooling", "press-shop", "pipe-shop", "welding", "inspection"]);

// a shop-floor photo for each capability card
const photos: Record<string, { src: string; alt: string; position?: string }> = {
  "press-shop": {
    src: "/images/facility/floor/press-line-safety-gear.jpg",
    alt: "Operators in hard hats, safety glasses and high-visibility vests running a line of mechanical power presses",
  },
  inspection: {
    src: "/images/facility/floor/faro-arm-inspection.jpg",
    alt: "Inspector in a Shaheen Automotive shirt measuring a checking fixture with a FARO Platinum Arm probe",
    position: "50% 64%",
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
  "design-tooling": {
    src: "/images/facility/floor/checking-fixture.jpg",
    alt: "Inspector clamping a stamped sheet metal panel into a checking fixture",
  },
  "surface-finishing": {
    src: "/images/facility/floor/surface-activation-tank-front-v2.jpg",
    alt: "Motor-driven perforated barrels in a Shaheen surface activation tank, with racks of pipe parts in the foreground",
    position: "50% 32%",
  },
};

export function CapabilitiesGrid({ capabilities }: { capabilities: Capability[] }) {
  const bySlug = Object.fromEntries(capabilities.map((c) => [c.slug, c]));
  const order = ["press-shop", "inspection", "pipe-shop", "welding", "design-tooling", "surface-finishing"];

  return (
    <section className="surface-paper bg-bg pb-section pt-0">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Capabilities"
            title="Manufacturing capabilities built around your production line."
          />
          <Reveal delay={0.06} className="shrink-0">
            <Link
              href="/capabilities"
              className="group inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
            >
              View all capabilities
              <ArrowUpRight
                size={15}
                weight="bold"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {order.map((slug, i) => {
            const cap = bySlug[slug];
            const Icon = icons[slug];
            const photo = photos[slug];
            // only these capabilities have their own section on /capabilities
            const href = anchored.has(slug) ? `/capabilities#${slug}` : "/capabilities";
            return (
              <Reveal key={slug} delay={i * 0.05} className="h-full">
                <SpotTrack className="card-lift group relative h-full overflow-hidden rounded-[1.75rem] border border-border bg-bg-elevated text-fg shadow-soft">
                  <Link href={href} className="flex h-full flex-col rounded-[1.75rem] p-2 outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2">
                    <div className="relative aspect-[16/9] overflow-hidden rounded-[1.25rem] bg-ink-2">
                      <Image
                        src={photo.src}
                        alt={photo.alt}
                        fill
                        sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                        {...blurProps(photo.src)}
                        style={photo.position ? { objectPosition: photo.position } : undefined}
                        className="object-cover grayscale-[35%] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.06] group-hover:grayscale-0 motion-reduce:transition-none"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-bg-inverted/75 via-bg-inverted/10 to-transparent"
                      />

                      <span className="mono-figure absolute left-3 top-3 rounded-full border border-white/20 bg-black/35 px-2.5 py-1 text-[11px] text-white backdrop-blur-md">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-accent-strong opacity-0 shadow-soft transition-[opacity,transform] duration-300 group-hover:rotate-45 group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none">
                        <ArrowUpRight size={15} weight="bold" />
                      </span>

                      <span className="absolute bottom-3 left-3 flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/35 text-white backdrop-blur-md transition-colors duration-300 group-hover:border-transparent group-hover:bg-accent">
                        <Icon size={20} weight="regular" />
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
                      <h3 className="text-lg font-semibold leading-snug transition-colors duration-200 group-hover:text-accent-strong">
                        {cap.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{cap.summary}</p>
                      <span className="mt-auto flex items-center gap-2 pt-4 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                        <span className="h-px w-5 bg-accent transition-[width] duration-300 group-hover:w-9 motion-reduce:transition-none" />
                        Explore
                      </span>
                    </div>
                  </Link>
                  <span className="spot-glow" aria-hidden="true" />
                </SpotTrack>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
