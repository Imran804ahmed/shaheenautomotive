import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import Image from "next/image";
import { blurProps } from "@/lib/image-meta";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { categoryPhotos, type ProductCategory } from "@/content/company";

export function ProductsShowcase({ categories }: { categories: ProductCategory[] }) {
  return (
    <section className="surface-paper bg-bg py-section">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Products"
            title="Jack and Hinges, Sheet Metal, Rods and Pipes"
            body="Jacks, hinges and stamped, bent and formed components built in-house, from die to dimensional inspection, for automotive, motorcycle and appliance OEMs."
          />
          <Reveal delay={0.1} className="shrink-0">
            <Link
              href="/products"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 text-sm font-semibold text-fg shadow-soft transition-colors duration-300 hover:border-accent hover:text-accent"
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

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 xl:grid-cols-4">
          {categories.map((cat, i) => {
            const photos = categoryPhotos[cat.slug].slice(0, 4);
            return (
              <Reveal key={cat.slug} delay={i * 0.07} className="h-full">
                <Tilt className="h-full">
                  <Link
                    href={`/products/${cat.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-bg-elevated p-2 shadow-soft transition-[box-shadow,border-color] duration-500 hover:border-accent/40 hover:shadow-lift"
                  >
                    <div className="relative aspect-[5/4] w-full shrink-0 overflow-hidden rounded-[1.35rem] bg-bg-inverted">
                      <Image
                        src={photos[0].src}
                        alt={photos[0].alt}
                        fill
                        sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 95vw"
                        {...blurProps(photos[0].src)}
                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
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
                          Product family
                        </span>
                        <h3 className="mt-2 text-2xl font-semibold leading-tight text-fg-inverted sm:text-[1.65rem] xl:text-[1.4rem]">
                          {cat.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col px-3 pb-3 pt-5 sm:px-4 sm:pb-4">
                      <p className="text-sm leading-relaxed text-fg-muted xl:line-clamp-4">{cat.summary}</p>

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
