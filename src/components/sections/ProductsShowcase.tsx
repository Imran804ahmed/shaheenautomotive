import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SpotTrack } from "@/components/ui/SpotTrack";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProductCategory } from "@/content/company";
import { cn } from "@/lib/cn";

type Shot = { src: string; alt: string };
const shot = (n: number, alt: string): Shot => ({ src: `/images/products/showcase/showcase-${n}.jpg`, alt });

// Primary studio shot + an alternate angle revealed on hover.
const categoryShots: Record<ProductCategory["slug"], [Shot, Shot]> = {
  "sheet-metal-parts": [
    shot(9, "Stamped sheet metal panel with punched mounting holes and weld nuts"),
    shot(17, "Deep-drawn channel bracket with ribbed flanges and pierced holes"),
  ],
  "formed-pipe-parts": [
    shot(2, "Formed hood hinge arm with pivot bracket, zinc plated"),
    shot(3, "Formed hood hinge assembly from an alternate angle"),
  ],
  "bent-rod-parts": [
    shot(33, "Zinc-plated scissor jack with formed saddle, lead screw and eye drive end"),
    shot(5, "Bent hinge arm with pivot pin and base bracket, yellow zinc finish"),
  ],
};

const categorySpecs: Record<ProductCategory["slug"], [string, string][]> = {
  "sheet-metal-parts": [
    ["Process", "Stamping, progressive & line dies"],
    ["Press range", "15–300 T"],
    ["Sectors", "Passenger cars · appliances"],
  ],
  "formed-pipe-parts": [
    ["Process", "NC / CNC bending, flaring"],
    ["Diameter", "ø10–38 mm"],
    ["Wall", "Up to 2.5 mm"],
  ],
  "bent-rod-parts": [
    ["Process", "Rod bending, bracket welding"],
    ["Parts", "Stands · brackets · jacks"],
    ["Sectors", "Motorcycles · cars"],
  ],
};

// Studio shots are lifted toward white. The featured card is taller than the
// photos' 3:2 frame, so it shows the whole part (contain) with feathered
// edges over a sweep matched to the photo backdrop instead of cropping.
const shotClass = "object-cover brightness-[1.1] contrast-[1.04] saturate-[0.9]";
const featuredShotClass =
  "!object-contain p-[4%] [mask-image:radial-gradient(ellipse_58%_54%_at_center,black_40%,transparent_100%)]";

export function ProductsShowcase({ categories }: { categories: ProductCategory[] }) {
  return (
    <section className="relative bg-bg-elevated py-24 sm:py-32">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Products"
            title="Components engineered to OEM drawing."
            body="Stamped, formed and bent parts built in-house from die to dimensional inspection, fitted to vehicles and appliances across Pakistan."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-fg shadow-soft transition-colors duration-300 hover:border-accent hover:text-accent-ink"
            >
              All product families
              <ArrowUpRight size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 lg:grid-cols-12 lg:grid-rows-2 lg:gap-6">
          {categories.map((cat, i) => {
            const [primary, alternate] = categoryShots[cat.slug];
            const featured = i === 0;
            return (
              <Reveal
                key={cat.slug}
                delay={i * 0.08}
                className={cn("h-full", featured ? "lg:col-span-7 lg:row-span-2" : "lg:col-span-5")}
              >
                <SpotTrack className="h-full">
                  <Link
                    href={`/products/${cat.slug}`}
                    className={cn(
                      "group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border bg-bg shadow-soft transition-[box-shadow,border-color,transform] duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift",
                      !featured && "sm:flex-row lg:flex-col"
                    )}
                  >
                    {/* studio stage */}
                    <div
                      className={cn(
                        "relative w-full overflow-hidden",
                        featured
                          ? "bg-[radial-gradient(85%_75%_at_50%_42%,#eceef2,#e1e4e9_70%,#d8dce1)]"
                          : "product-stage",
                        featured
                          ? "aspect-[3/2] lg:aspect-auto lg:min-h-[28rem] lg:flex-1"
                          : "aspect-[3/2] sm:aspect-auto sm:min-h-64 sm:w-1/2 lg:aspect-[16/9] lg:w-full"
                      )}
                    >
                      <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
                        <Image
                          src={primary.src}
                          alt={primary.alt}
                          fill
                          sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
                          className={cn(shotClass, featured && featuredShotClass, "transition-opacity duration-500 group-hover:opacity-0")}
                        />
                        <Image
                          src={alternate.src}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes={featured ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 30vw, 100vw"}
                          className={cn(shotClass, featured && featuredShotClass, "opacity-0 transition-opacity duration-500 group-hover:opacity-100")}
                        />
                      </div>
                      {/* studio falloff: soft vignette + a metallic horizon line where the sweep meets the floor */}
                      <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgb(13_17_20/0.14))]" />
                      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-white/50 to-transparent" />
                      <span className="sheen sheen-hover" aria-hidden="true" />

                      <span className="mono-figure absolute left-5 top-5 text-[11px] text-fg-muted">
                        {String(i + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                      </span>
                      <span className="tech-label absolute right-5 top-5 hidden rounded-full [@media(hover:hover)]:block bg-bg-elevated/80 px-2.5 py-1 text-[10px] text-fg-muted backdrop-blur">
                        Hover · alt view
                      </span>
                    </div>

                    {/* spec card */}
                    <div
                      className={cn(
                        "relative flex flex-col bg-bg-elevated p-6 sm:p-7",
                        !featured && "sm:flex-1 lg:flex-none"
                      )}
                    >
                      <span className="tech-label text-accent-ink">{cat.shortTitle}</span>
                      <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-fg sm:text-[1.7rem]">{cat.title}</h3>
                      {featured && <p className="mt-3 max-w-lg text-sm leading-relaxed text-fg-muted">{cat.summary}</p>}

                      <dl className="mt-5 divide-y divide-border border-y border-border">
                        {categorySpecs[cat.slug].map(([k, v]) => (
                          <div key={k} className="flex items-baseline justify-between gap-4 py-2.5">
                            <dt className="tech-label shrink-0 text-fg-muted">{k}</dt>
                            <dd className="mono-figure text-right text-xs text-fg sm:text-[13px]">{v}</dd>
                          </div>
                        ))}
                      </dl>

                      <div className="mt-auto flex items-center justify-between pt-5">
                        <span className="text-sm font-semibold text-fg transition-colors duration-300 group-hover:text-accent-ink">
                          View specifications
                        </span>
                        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-inverted text-white transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-accent-ink">
                          <ArrowUpRight size={16} weight="bold" />
                        </span>
                      </div>
                    </div>

                    <span className="spot-border" aria-hidden="true" />
                  </Link>
                </SpotTrack>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
