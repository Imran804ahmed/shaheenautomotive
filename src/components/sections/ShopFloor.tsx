import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import type { FloorArea } from "@/content/company";

/** Home-page teaser for /facility: the machines and people behind the parts. */
export function ShopFloor({ areas }: { areas: FloorArea[] }) {
  const [lead, ...rest] = areas;

  return (
    <section className="surface-ink overflow-hidden rounded-[2.5rem] py-20 sm:rounded-[3.5rem] sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal>
            <p className="mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              <span className="h-px w-8 bg-brass" />
              On the Shop Floor
            </p>
            <h2 className="text-balance text-display-md font-semibold text-fg-inverted">
              The machines and people <span className="text-brass-gradient">behind every part.</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-fg-inverted-muted sm:text-lg">
              Every part we ship is pressed and welded here, by our own operators on our own machines.
            </p>
          </Reveal>

          <RevealGroup className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {areas.map((area) => (
              <RevealItem key={area.key} className="flex gap-5 py-5">
                <span className="mono-figure pt-0.5 text-sm text-brass">{area.number}</span>
                <div>
                  <h3 className="text-lg font-semibold tracking-tight text-fg-inverted">{area.label}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-fg-inverted-muted">{area.body}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>

          <Reveal className="mt-10">
            <Button href="/facility" variant="brass">
              Inside the Plant
            </Button>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:col-span-7">
          <Reveal from="scale" className="col-span-2">
            <figure className="relative">
              <ParallaxImage
                src={lead.cover}
                alt={lead.coverAlt}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="aspect-[16/10] rounded-[1.75rem] ring-1 ring-white/10"
              />
              <figcaption className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                {lead.label}
              </figcaption>
            </figure>
          </Reveal>

          {rest.map((area, i) => (
            <Reveal key={area.key} delay={0.08 * (i + 1)}>
              <figure className="group relative aspect-[4/5] overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
                <Image
                  src={area.cover}
                  alt={area.coverAlt}
                  fill
                  sizes="(min-width: 1024px) 27vw, 50vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <figcaption className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
                  {area.label}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
