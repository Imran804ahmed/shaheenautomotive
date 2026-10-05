import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { BackdropImage } from "@/components/ui/BackdropImage";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { InViewVideo } from "@/components/ui/InViewVideo";

/** Home-page teaser for /facility: the machines and people behind the parts. */
export function ShopFloor() {
  return (
    <section className="surface-ink overflow-hidden py-section-sm">
      {/* parts-store photo behind the copy, lit the same way as the home hero: dark on the copy side, opening up to the right */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <BackdropImage src="/images/facility/storage/parts-store.webp" />
        <div className="scrim-hero" />
      </div>
      <Container className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <Reveal>
            <Eyebrow tone="brassSoft" className="mb-4">
              On the Shop Floor
            </Eyebrow>
            <h2 className="text-balance text-display-md font-semibold text-white">
              The machines and people{" "}
              <span className="text-brass-gradient">behind every part.</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/85 sm:text-lg">
              Every part we ship is pressed and welded here, by our own
              operators on our own machines.
            </p>
          </Reveal>

          <Reveal className="mt-8">
            <Button href="/facility" variant="brass">
              Inside the Plant
            </Button>
          </Reveal>
        </div>

        <Reveal from="scale" className="lg:col-span-7">
          <VideoCard />
        </Reveal>
      </Container>
    </section>
  );
}

/** Looping 30s cut of the operators across the press shop, pipe bending, welding floor, QA/QC lab and warehouse, framed like the site's photo tiles: thin white border, glowing edge and arrow on hover. */
function VideoCard() {
  return (
    <Link
      href="/facility"
      className="group block rounded-[1.75rem] bg-white/80 p-px shadow-[0_24px_50px_-20px_rgb(0_0_0/0.6)] transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_28px_60px_-18px_rgb(23_112_63/0.6)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-glow motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <div className="rounded-[calc(1.75rem-1px)] bg-bg-inverted/80 p-1.5 backdrop-blur-md">
        <figure className="relative aspect-[16/9] overflow-hidden rounded-[1.35rem] bg-accent-strong ring-1 ring-white/20">
          <InViewVideo
            src="/videos/shop-floor.mp4"
            poster="/videos/shop-floor-poster.jpg"
            label="SAPL operators running the press lines, bending tubes on hydraulic pipe benders and MIG welding parts, followed by the QA/QC lab and the SAPL warehouse"
            className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-inverted/85 via-bg-inverted/10 to-transparent" />
          <span
            aria-hidden="true"
            className="absolute inset-x-6 top-0 h-[2px] origin-center scale-x-0 rounded-full bg-gradient-to-r from-transparent via-glow to-transparent transition-transform duration-700 group-hover:scale-x-100"
          />
          <span
            aria-hidden="true"
            className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-bg-inverted/50 text-white ring-1 ring-white/20 backdrop-blur-md transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-accent group-hover:ring-glow/50"
          >
            <ArrowUpRight size={15} weight="bold" />
          </span>
          <figcaption className="absolute inset-x-0 bottom-0 flex items-end gap-3 p-5 sm:p-6">
            <span className="text-lg font-semibold leading-tight text-white sm:text-xl">
              Our people on the shop floor
            </span>
          </figcaption>
        </figure>
      </div>
    </Link>
  );
}
