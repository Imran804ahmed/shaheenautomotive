import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { ProductCategory } from "@/content/company";

const categoryImages: Record<ProductCategory["slug"], { src: string; alt: string }> = {
  "sheet-metal-parts": {
    src: "/images/products/toyota/toyota-component-3.jpeg",
    alt: "Stamped sheet metal shield component",
  },
  "formed-pipe-parts": {
    src: "/images/products/suzuki/suzuki-component-5-pipe.jpeg",
    alt: "Formed pipe water inlet component",
  },
  "bent-rod-parts": {
    src: "/images/products/yamaha/yamaha-component-2-stand.jpeg",
    alt: "Bent rod motorcycle stand component",
  },
};

export function ProductsShowcase({ categories }: { categories: ProductCategory[] }) {
  return (
    <section className="surface-paper bg-bg py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="Products" title="Three product families, one production system." />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {categories.map((cat, i) => {
            const img = categoryImages[cat.slug];
            return (
              <Reveal key={cat.slug} delay={i * 0.07}>
                <Tilt className="h-full">
                  <Link
                    href={`/products/${cat.slug}`}
                    className="group block h-full overflow-hidden rounded-[1.75rem] border border-border bg-bg-elevated shadow-soft transition-shadow duration-300 hover:shadow-lift"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-inverted">
                      <Image
                        src={img.src}
                        alt={img.alt}
                        fill
                        sizes="(min-width: 768px) 33vw, 90vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-inverted/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      <span className="spot-glow" aria-hidden="true" />
                    </div>
                    <div className="p-6 sm:p-7">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xl font-semibold text-fg">{cat.title}</h3>
                        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-fg">
                          <ArrowUpRight size={16} weight="bold" />
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-fg-muted">{cat.summary}</p>
                    </div>
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
