import type { Metadata } from "next";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Leadership } from "@/components/sections/Leadership";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { StatCounter } from "@/components/ui/StatCounter";
import { Target, Compass } from "@phosphor-icons/react/dist/ssr";
import {
  history,
  vision,
  mission,
  aboutPillars,
  aboutStats,
  industriesServed,
  facilityPhotos,
  leadership,
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
        intro="Shaheen Automotive (Pvt.) Ltd. designs and manufactures sheet metal, formed pipe and bent rod components for the automotive and home appliance industries."
      />

      <section className="bg-bg py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                Since {history.founded}
              </p>
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

      <Leadership members={leadership} />

      <section className="rounded-[2.5rem] bg-bg-elevated shadow-soft sm:rounded-[3.5rem] py-20 sm:py-24">
        <Container className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {aboutStats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <p className="stat-figure text-3xl sm:text-4xl">
                <StatCounter value={s.value} />
              </p>
              <p className="stat-label mt-3 leading-snug">{s.label}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      <section className="bg-bg py-20 sm:py-24">
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

      <section className="rounded-[2.5rem] bg-bg-elevated shadow-soft sm:rounded-[3.5rem] py-20 sm:py-24">
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

      <section className="bg-bg py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal from="left">
            <ParallaxImage
              src={facilityPhotos[0].src}
              alt={facilityPhotos[0].alt}
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="aspect-[4/3] rounded-[2rem] border border-border bg-bg-inverted shadow-lift"
            />
          </Reveal>
          <Reveal delay={0.08} from="right">
            <h2 className="text-display-md font-semibold tracking-tight text-fg">Industries served</h2>
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

      <CtaBanner
        heading="Looking for a long-term manufacturing partner?"
        body="Tell us about your programme and volume, and our team will assess feasibility against our current capacity."
      />
    </>
  );
}
