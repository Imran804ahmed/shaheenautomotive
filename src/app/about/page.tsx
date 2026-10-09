import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { PageHeader } from "@/components/sections/PageHeader";
import { blurProps } from "@/lib/image-meta";
import { Leadership } from "@/components/sections/Leadership";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Target, Compass } from "@phosphor-icons/react/dist/ssr";
import {
  history,
  vision,
  mission,
  aboutPillars,
  industriesServed,
  leadership,
  managementTeam,
} from "@/content/company";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "From Shaheen Engineering Works, founded in 1983, to Shaheen Automotive (Pvt.) Ltd. today: our history, vision, mission and industries served.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About us"
        title="Four decades of precision manufacturing."
        intro="Shaheen Automotive (Pvt.) Ltd. designs and manufactures jack assemblies, sheet metal, bent rod and formed pipe components for the automotive and home appliance industries."
        image={{
          src: "/images/facility/floor/press-line-operators.jpg",
          position: "center 60%",
        }}
        flat
      />

      <section className="bg-bg py-section-sm">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <Eyebrow>Since {history.founded}</Eyebrow>
              <h2 className="mt-3 text-display-md font-semibold tracking-tight text-fg">
                From {history.foundedAs} to {history.currentName}
              </h2>
            </div>
          </Reveal>
          <div className="space-y-5">
            {history.narrative.map((p, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <p className="text-base leading-relaxed text-fg-muted">{p}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-gradient-to-b from-[#eceef0] to-white py-section-sm">
        <Container className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-sm border border-border bg-bg-elevated shadow-soft p-8">
              <Compass size={26} className="text-accent" />
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-fg">Vision</h3>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">{vision}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="h-full rounded-sm border border-border bg-bg-elevated shadow-soft p-8">
              <Target size={26} className="text-accent" />
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-fg">Mission</h3>
              <p className="mt-3 text-base leading-relaxed text-fg-muted">{mission}</p>
            </div>
          </Reveal>
        </Container>
      </section>

      <Leadership members={leadership} management={managementTeam} />

      <section className="rounded-section bg-bg-elevated shadow-soft py-section-sm">
        <Container>
          <Reveal>
            <h2 className="max-w-xl text-balance text-display-md font-semibold tracking-tight text-fg">
              What defines how we work.
            </h2>
          </Reveal>
          <RevealGroup className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {aboutPillars.map((p) => (
              <RevealItem key={p.title} className="bg-bg-elevated p-6">
                <h3 className="text-base font-semibold tracking-tight text-fg">{p.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{p.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="bg-bg py-section-sm">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal from="left">
            <ParallaxImage
              src="/images/facility/floor/komatsu-200-press.jpg"
              alt="Komatsu 200-tonne straight-side power press, P.P. 53, on the SAPL press shop floor"
              sizes="(min-width: 1024px) 28rem, 90vw"
              blurDataURL={blurProps("/images/facility/floor/komatsu-200-press.jpg").blurDataURL}
              className="mx-auto aspect-[4/5] max-w-md rounded-[2rem] border border-border bg-bg-inverted shadow-lift lg:mx-0"
            />
          </Reveal>
          <Reveal delay={0.08} from="right">
            <h2 className="text-display-md font-semibold tracking-tight text-fg">Industries Served</h2>
            <ul className="mt-6 space-y-4">
              {industriesServed.map((ind) => (
                <li key={ind} className="flex items-start gap-3 border-t border-border pt-4 text-fg">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="text-base">{ind}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
