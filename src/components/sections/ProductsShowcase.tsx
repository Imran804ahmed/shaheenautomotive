import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { ImageCycle } from "@/components/ui/ImageCycle";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProductCategory } from "@/content/company";

const img = (n: number, alt: string) => ({ src: `/images/products/showcase/showcase-${n}.jpg`, alt });

const categoryImages: Record<ProductCategory["slug"], { src: string; alt: string }[]> = {
  "sheet-metal-parts": [
    img(9, "Stamped sheet metal panel with punched mounting holes"),
    img(7, "Formed sheet metal reinforcement panel"),
    img(10, "Sheet metal bracket panel with weld nuts"),
    img(8, "Sheet metal reinforcement panel, reverse side"),
  ],
  "formed-pipe-parts": [
    img(2, "Formed hood hinge arm with pivot bracket"),
    img(3, "Formed hood hinge assembly, alternate angle"),
    img(4, "Formed hinge arm with mounting bracket"),
  ],
  "bent-rod-parts": [
    img(5, "Bent hinge arm with pivot pin, yellow zinc finish"),
    img(6, "Hinge arm and base plate, yellow zinc finish"),
    img(1, "Scissor jack assembly"),
  ],
};

// One headline figure per family, taken from the category summaries.
const categorySpec: Record<ProductCategory["slug"], { value: string; label: string }> = {
  "sheet-metal-parts": { value: "15–300 T", label: "Press fleet range" },
  "formed-pipe-parts": { value: "ø10–38 mm", label: "Pipe diameter range" },
  "bent-rod-parts": { value: "Motorcycle", label: "Primary OEM sector" },
};

export function ProductsShowcase({ categories }: { categories: ProductCategory[] }) {
  return (
    <section className="surface-paper bg-bg py-20 sm:py-28">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Products"
            title="Three product families, one production system."
            body="Stamped, bent and formed components built in-house, from die to dimensional inspection, for automotive, motorcycle and appliance OEMs."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-fg shadow-soft transition-colors duration-300 hover:border-accent hover:text-accent"
            >
              View all products
              <ArrowUpRight
                size={14}
                weight="bold"
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </Reveal>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {categories.map((cat, i) => {
            const photos = categoryImages[cat.slug];
            return (
              <Reveal key={cat.slug} delay={i * 0.07} className="h-full">
                <Tilt className="h-full">
                  <Link
                    href={`/products/${cat.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-bg-elevated p-2 shadow-soft sm:flex-row lg:flex-col transition-[box-shadow,border-color] duration-500 hover:border-accent/40 hover:shadow-lift"
                  >
                    <div className="relative aspect-[5/4] w-full shrink-0 overflow-hidden rounded-[1.35rem] bg-bg-inverted sm:aspect-auto sm:min-h-80 sm:w-[46%] lg:aspect-[5/4] lg:min-h-0 lg:w-full">
                      <ImageCycle
                        images={photos}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 45vw, 95vw"
                        offset={i * 1200}
                        indicators
                        className="group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-inverted via-bg-inverted/35 to-bg-inverted/10" />
                      <div className="absolute inset-0 bg-[radial-gradient(28rem_16rem_at_0%_100%,rgb(56_194_122/0.22),transparent_65%)] opacity-60 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="spot-glow" aria-hidden="true" />

                      <span className="mono-figure absolute left-4 top-4 z-10 rounded-full border border-fg-inverted/15 bg-bg-inverted/50 px-3 py-1 text-[11px] font-medium tracking-wider text-fg-inverted backdrop-blur-md">
                        {String(i + 1).padStart(2, "0")} / {String(categories.length).padStart(2, "0")}
                      </span>

                      <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
                        <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-brass">
                          <span className="h-px w-5 bg-brass transition-[width] duration-500 group-hover:w-9" />
                          {cat.shortTitle}
                        </span>
                        <h3 className="mt-2 text-2xl font-semibold leading-tight text-fg-inverted sm:text-[1.65rem]">
                          {cat.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col px-3 pb-3 pt-5 sm:px-5 sm:pb-4 lg:px-5">
                      <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-1 rounded-2xl border border-border bg-bg px-4 py-3.5">
                        <div>
                          <div className="stat-figure whitespace-nowrap text-[clamp(1.35rem,1.1rem+1vw,1.6rem)]">{categorySpec[cat.slug].value}</div>
                          <div className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-fg-muted">
                            {categorySpec[cat.slug].label}
                          </div>
                        </div>
                        <span className="mono-figure shrink-0 text-[11px] text-fg-muted">{photos.length} photos</span>
                      </div>

                      <p className="mt-5 line-clamp-3 text-sm leading-relaxed text-fg-muted">{cat.summary}</p>

                      <ul className="mb-6 mt-5 flex flex-wrap gap-2">
                        {cat.processTags.slice(0, 3).map((tag) => (
                          <li
                            key={tag}
                            className="rounded-full border border-accent/15 bg-accent-soft px-3 py-1 text-xs font-medium text-accent-strong"
                          >
                            {tag}
                          </li>
                        ))}
                      </ul>

                      <div className="mt-auto flex items-center justify-between border-t border-border pt-5">
                        <span className="relative text-sm font-semibold text-fg transition-colors duration-300 group-hover:text-accent">
                          Explore range
                          <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-500 group-hover:scale-x-100" />
                        </span>
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-inverted text-fg-inverted transition-[background-color,color,transform] duration-300 group-hover:rotate-45 group-hover:bg-accent group-hover:text-accent-fg">
                          <ArrowUpRight size={16} weight="bold" />
                        </span>
                      </div>
                    </div>

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-8 top-0 h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-transparent via-brass to-transparent transition-transform duration-700 group-hover:scale-x-100"
                    />
                  </Link>
                </Tilt>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
