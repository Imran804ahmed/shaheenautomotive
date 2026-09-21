import Link from "next/link";
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
import { Gear } from "@/components/ui/Gear";
import type { Capability } from "@/content/company";
import { cn } from "@/lib/cn";

const icons: Record<string, React.ComponentType<{ size?: number; weight?: "regular" | "bold" }>> = {
  "design-tooling": Wrench,
  "press-shop": Cube,
  "pipe-shop": FlowArrow,
  welding: Fire,
  "surface-finishing": Drop,
  inspection: Crosshair,
};

export function CapabilitiesGrid({ capabilities }: { capabilities: Capability[] }) {
  const bySlug = Object.fromEntries(capabilities.map((c) => [c.slug, c]));
  const order = ["press-shop", "inspection", "pipe-shop", "welding", "design-tooling", "surface-finishing"];

  return (
    <section className="bg-bg pb-20 pt-0 sm:pb-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Capabilities"
            title="Manufacturing capabilities built around your production line."
          />
          <Reveal delay={0.06}>
            <Link
              href="/capabilities"
              className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-accent transition-colors hover:text-accent-strong"
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

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
          {order.map((slug, i) => {
            const cap = bySlug[slug];
            const Icon = icons[slug];
            const isWide = slug === "press-shop";
            const isFull = slug === "surface-finishing";
            const isDark = slug === "press-shop";
            const isSoft = slug === "inspection";
            return (
              <Reveal
                key={slug}
                delay={i * 0.05}
                from={isWide || isFull ? "scale" : "up"}
                className={cn(isWide && "sm:col-span-2", isFull && "sm:col-span-3")}
              >
                <div
                  className={cn(
                    "card-lift relative flex h-full flex-col justify-between overflow-hidden rounded-[1.75rem] border p-6 sm:p-8",
                    isFull ? "sm:flex-row sm:items-center sm:gap-8" : "min-h-[240px]",
                    isDark
                      ? "surface-ink border-transparent text-fg-inverted shadow-deep"
                      : isSoft
                      ? "border-accent/15 bg-accent-soft text-fg"
                      : "border-border bg-bg-elevated text-fg shadow-soft"
                  )}
                >
                  {isDark && (
                    <Gear className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 opacity-70" />
                  )}
                  <div className={cn("relative", isFull && "flex items-center gap-4")}>
                    <span
                      className={cn(
                        "inline-flex h-12 w-12 items-center justify-center rounded-2xl",
                        isDark ? "bg-white/10 text-brass" : "bg-accent/10 text-accent"
                      )}
                    >
                      <Icon size={24} weight="regular" />
                    </span>
                    <h3 className={cn("text-xl font-semibold", !isFull && "mt-6")}>{cap.title}</h3>
                  </div>
                  <div className="relative">
                    <p
                      className={cn(
                        "text-sm leading-relaxed",
                        isDark ? "max-w-md text-fg-inverted-muted" : "text-fg-muted",
                        !isFull && "mt-3"
                      )}
                    >
                      {cap.body}
                    </p>
                    {cap.note && <p className="mt-2 text-xs italic text-fg-muted">{cap.note}</p>}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
