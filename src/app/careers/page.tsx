import type { Metadata } from "next";
import Image from "next/image";
import {
  PencilRuler,
  Stack,
  Lightning,
  Crosshair,
  Wrench,
  ChartLineUp,
  GraduationCap,
  HardHat,
  Handshake,
  EnvelopeSimple,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotTrack } from "@/components/ui/SpotTrack";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Work in tooling, press shop, welding, quality and production at Shaheen Automotive (Pvt.) Ltd., an automotive component manufacturer in Pakistan since 1983.",
  alternates: { canonical: "/careers" },
};

const disciplines: { icon: Icon; title: string; body: string }[] = [
  { icon: PencilRuler, title: "Tool & die design", body: "Process and tooling design in UG NX, Creo and AutoForm, and building dies on CNC and wire-cut machines." },
  { icon: Stack, title: "Press shop", body: "Setting and running mechanical, hydraulic and pneumatic presses from 15 to 300 tons." },
  { icon: Lightning, title: "Welding & assembly", body: "CO₂, spot, arc and induction welding on dedicated fixtures for pipe and sheet metal assemblies." },
  { icon: Crosshair, title: "Quality & metrology", body: "Checking fixtures, gauging and FARO arm laser scanning, and OTS approvals with OEM quality teams." },
  { icon: ChartLineUp, title: "Production planning", body: "Scheduling mass production against OEM delivery orders across multiple customer programmes." },
  { icon: Wrench, title: "Maintenance", body: "Keeping the press fleet, pipe benders and welding equipment running shift after shift." },
];

const values: { icon: Icon; title: string; body: string }[] = [
  { icon: GraduationCap, title: "Ongoing training", body: "Continuous improvement through innovation and ongoing training is written into our mission." },
  { icon: Handshake, title: "Real OEM programmes", body: "Work on parts fitted to vehicles from Toyota, Suzuki and Yamaha programmes built in Pakistan." },
  { icon: HardHat, title: "Safety comes first", body: "It is on the wall of the welding bay for a reason: safe practice is part of every job here." },
];

export default function CareersPage() {
  const email = siteConfig.careersEmail || siteConfig.contact.email;
  const mailto = `mailto:${email}?subject=${encodeURIComponent("Career application: [role or discipline]")}`;

  return (
    <>
      <PageHeader
        image={{ src: "/images/facility/floor/pipe-bender-setup.jpg", alt: "Two operators working together at a hydraulic pipe bending machine" }}
        eyebrow="Careers"
        title="Build the parts that keep production lines moving."
        intro="Engineers, operators and quality specialists at Shaheen Automotive turn OEM drawings into production parts every day. If precision work appeals to you, we'd like to hear from you."
      />

      <section className="bg-bg py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="Where you could work"
            title="Six disciplines, one plant."
            body="Most roles sit inside one of the shops that take a part from die design to dispatch."
          />
          <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
            {disciplines.map((d, i) => {
              const DIcon = d.icon;
              return (
                <RevealItem key={d.title} className="h-full">
                  <SpotTrack className="card-lift surface-metal relative h-full overflow-hidden rounded-[1.75rem] p-7">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-inverted text-glow shadow-[inset_0_1px_0_rgb(255_255_255/0.12)]">
                        <DIcon size={24} weight="duotone" />
                      </span>
                      <span className="mono-figure text-[11px] text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                    </div>
                    <h3 className="mt-6 text-xl font-bold tracking-tight text-fg">{d.title}</h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{d.body}</p>
                    <span className="spot-glow" aria-hidden="true" />
                    <span className="spot-border" aria-hidden="true" />
                  </SpotTrack>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      <section className="surface-ink grain relative py-24 sm:py-28">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <SectionHeading onDark eyebrow="Working at SAPL" title="Skills that are learned on the shop floor." />
            <RevealGroup className="mt-10 divide-y divide-white/[0.07] border-y border-white/[0.07]">
              {values.map((v) => {
                const VIcon = v.icon;
                return (
                  <RevealItem key={v.title} className="flex gap-5 py-6">
                    <VIcon size={26} weight="duotone" className="shrink-0 text-glow" />
                    <div>
                      <h3 className="text-lg font-bold tracking-tight text-white">{v.title}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-fg-inverted-muted">{v.body}</p>
                    </div>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
          <Reveal from="scale" className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden rounded-[1.75rem] ring-1 ring-white/10">
              <Image src="/images/facility/floor/press-line-operators.jpg" alt="Three operators working side by side at a row of power presses" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
              <Image src="/images/facility/floor/jack-assembly.jpg" alt="Worker assembling a zinc-plated scissor jack at a bench" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-square overflow-hidden rounded-[1.5rem] ring-1 ring-white/10">
              <Image src="/images/facility/floor/checking-fixture-closeup.jpg" alt="Gloved inspector seating a panel against the locators of a checking fixture" fill sizes="(min-width: 1024px) 22vw, 50vw" className="object-cover" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-bg py-24 sm:py-28">
        <Container>
          <Reveal>
            <div className="surface-metal flex flex-col items-start gap-8 rounded-[2rem] p-8 sm:p-12 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <p className="tech-label flex items-center gap-3 text-accent-ink">
                  <span className="h-px w-10 bg-gradient-to-r from-accent to-transparent" />
                  Current openings
                </p>
                <h2 className="mt-5 text-balance text-display-md text-fg">No roles are advertised right now.</h2>
                <p className="mt-5 text-base leading-relaxed text-fg-muted">
                  We still welcome general applications. Email your CV with the discipline you&apos;re interested in and
                  we&apos;ll keep it on file for when a position opens.
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-start gap-3">
                <Button href={mailto} external variant="primary" showArrow={false}>
                  <EnvelopeSimple size={18} weight="bold" />
                  Send your CV
                </Button>
                <p className="mono-figure text-xs text-fg-muted wrap-anywhere">{email}</p>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
