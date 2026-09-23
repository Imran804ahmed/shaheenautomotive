import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/sections/PageHeader";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SpotTrack } from "@/components/ui/SpotTrack";
import { clients, productPrograms, industriesServed } from "@/content/company";

export const metadata: Metadata = {
  title: "Customers",
  description:
    "OEM and industry relationships referenced in Shaheen Automotive's company profile, including verified component examples for Toyota, Pak Suzuki and Yamaha.",
  alternates: { canonical: "/customers" },
};

export default function CustomersPage() {
  const referenced = clients.filter((c) => !c.hasVerifiedExamples);

  return (
    <>
      <PageHeader
        eyebrow="Customers"
        title="OEM and industry relationships."
        intro="Client logos and named part examples below are drawn directly from SAPL's company profile. Where we show specific component photographs, that program has a verified, documented example; other logos are shown as referenced relationships without a photographed example on file."
      />

      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Programmes with verified component examples
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {productPrograms.map((program, i) => (
              <Reveal key={program.oemSlug} delay={i * 0.06}>
                <SpotTrack className="h-full">
                  <Link
                    href={`/products/${program.oemSlug === "toyota" ? "sheet-metal-parts" : program.oemSlug === "yamaha" ? "bent-rod-parts" : "formed-pipe-parts"}`}
                    className="card-lift group relative block h-full overflow-hidden rounded-sm border border-border bg-bg-elevated p-6 shadow-soft"
                  >
                    <div className="flex h-9 items-center">
                      <Image
                        src={program.logo}
                        alt={program.oemName}
                        width={110}
                        height={36}
                        className="h-7 w-auto object-contain"
                      />
                    </div>
                    <p className="mt-4 text-sm leading-relaxed text-fg-muted">{program.summary}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                      View component examples
                      <ArrowUpRight
                        size={14}
                        weight="bold"
                        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </span>
                    <span className="spot-glow" aria-hidden="true" />
                  </Link>
                </SpotTrack>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="rounded-[2.5rem] bg-bg-elevated shadow-soft sm:rounded-[3.5rem] py-16 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
              Additional relationships referenced in company materials
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-fg-muted">
              These logos appear in SAPL&apos;s company profile without an accompanying photographed component example.
            </p>
          </Reveal>
          <RevealGroup className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {referenced.map((client) => (
              <RevealItem
                key={client.name}
                className="flex h-24 items-center justify-center rounded-sm border border-border bg-bg p-6"
              >
                <Image
                  src={client.logo}
                  alt={client.name}
                  width={110}
                  height={40}
                  className="max-h-9 w-auto object-contain grayscale"
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="bg-bg py-16 sm:py-20">
        <Container>
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">Industries served</h2>
          </Reveal>
          <div className="mt-6 flex flex-wrap gap-3">
            {industriesServed.map((ind) => (
              <span
                key={ind}
                className="rounded-full border border-border bg-bg-elevated px-4 py-2 text-sm text-fg-muted shadow-soft"
              >
                {ind}
              </span>
            ))}
          </div>
        </Container>
      </section>

      <CtaBanner
        heading="Sourcing for a new OEM programme?"
        body="Tell us the component category and target OEM, and we'll confirm whether it fits our current capability set."
      />
    </>
  );
}
