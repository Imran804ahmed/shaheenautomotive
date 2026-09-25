import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle, SealWarning } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";
import {
  certificationsNote,
  namedAwards,
  awardPhotos,
  equipmentInspection,
} from "@/content/company";

export const metadata: Metadata = {
  title: "Quality",
  description:
    "How Shaheen Automotive verifies quality from OTS sample inspection through trial production and mass production, plus certifications and awards.",
  alternates: { canonical: "/quality" },
};

const checkpoints = [
  {
    title: "OTS sample inspection",
    body: "Once tooling is complete, an off-tool sample is produced and inspected jointly by the SAPL quality team and the customer's quality department before the part is approved.",
  },
  {
    title: "Trial production & line verification",
    body: "A line verification process is run in the presence of the customer's team, confirming the production line is ready for volume before mass production begins.",
  },
  {
    title: "Production quality assurance",
    body: "Once in mass production, parts are delivered against schedule with consistent quality checks maintained through the run.",
  },
];

export default function QualityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quality"
        title="Quality verified at every stage, not just at the end."
        intro="From the first off-tool sample through trial production and into mass production, every part is checked against customer and SAPL quality requirements before it ships."
      />

      <section className="bg-bg py-20 sm:py-24">
        <Container>
          <RevealGroup className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
            {checkpoints.map((c) => (
              <RevealItem key={c.title} className="card-lift rounded-[1.5rem] border border-border bg-bg-elevated p-7 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <CheckCircle size={24} />
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight text-fg">{c.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{c.body}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="rounded-[2.5rem] bg-bg-elevated shadow-soft sm:rounded-[3.5rem] py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className="text-display-md font-semibold tracking-tight text-fg">
              Dimensional inspection
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-fg-muted">
              A FARO Arm with laser scanner supports manual and automated inspection of individual parts, sub-components and final assemblies, alongside conventional gauging equipment.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <ul className="divide-y divide-border rounded-sm border border-border bg-bg">
              {equipmentInspection.map((eq) => (
                <li key={eq.name} className="px-5 py-4 text-sm font-medium text-fg">
                  {eq.name}
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section className="bg-bg py-20 sm:py-24">
        <Container>
          <Reveal className="max-w-2xl rounded-sm border border-border bg-bg-elevated shadow-soft p-7">
            <SealWarning size={24} className="text-fg-muted" />
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-fg">{certificationsNote.headline}</h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{certificationsNote.body}</p>
          </Reveal>
        </Container>
      </section>

      <section className="rounded-[2.5rem] bg-bg-elevated shadow-soft sm:rounded-[3.5rem] py-20 sm:py-24">
        <Container>
          <Reveal>
            <h2 className="text-display-md font-semibold tracking-tight text-fg">
              Awards & recognition
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
              Awards referenced in SAPL&apos;s company profile, from customer supplier conventions between 1998 and 2024.
            </p>
          </Reveal>

          <RevealGroup className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-2">
            {namedAwards.map((a, i) => {
              const isLastOdd = namedAwards.length % 2 !== 0 && i === namedAwards.length - 1;
              return (
                <RevealItem
                  key={a.title + a.year}
                  className={cn(
                    "flex items-start justify-between gap-4 bg-bg-elevated p-5",
                    isLastOdd && "sm:col-span-2"
                  )}
                >
                  <div>
                    <p className="text-sm font-medium text-fg">{a.title}</p>
                    <p className="mt-1 text-xs text-fg-muted">{a.awardedBy}</p>
                  </div>
                  {a.year && <span className="mono-figure shrink-0 text-xs text-accent">{a.year}</span>}
                </RevealItem>
              );
            })}
          </RevealGroup>

          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {awardPhotos.map((award) => (
              <Reveal key={award.title + award.year}>
                <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-bg">
                  {award.image && (
                    <Image
                      src={award.image}
                      alt={`${award.title}, ${award.awardedBy}`}
                      fill
                      sizes="(min-width: 1024px) 20vw, 33vw"
                      className="object-contain p-3"
                    />
                  )}
                </div>
                <p className="mt-2.5 text-xs font-medium leading-snug text-fg">{award.title}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        heading="Want our quality documentation for a sourcing review?"
        body="Tell us which programme you're evaluating us for and we'll share the relevant process and inspection records."
      />
    </>
  );
}
