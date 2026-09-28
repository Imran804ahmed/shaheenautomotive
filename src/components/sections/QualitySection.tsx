import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Trophy } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { QualityBadge } from "@/components/ui/QualityBadge";
import type { Award } from "@/content/company";

const badges = [
  { title: "ISO 9001", caption: "Quality management" },
  { title: "ISO 14001", caption: "Environmental mgmt" },
  { title: "FARO 3D", caption: "Laser metrology" },
  { title: "OTS", caption: "Dual QA approval" },
];

// Inspection gates, from the development-to-production process and
// inspection equipment listed in the company profile.
const gates = [
  { code: "G1", title: "Off-tool sample", body: "First parts off new tooling are inspected by SAPL quality and the customer's quality department." },
  { code: "G2", title: "Line verification", body: "Trial production is run in front of the customer's team before mass production is released." },
  { code: "G3", title: "Fixture gauging", body: "Checking fixtures, height gauges, micrometers and verniers hold every batch to drawing." },
  { code: "G4", title: "3D laser scan", body: "FARO arm with laser scanner for parts, sub-assemblies and final assemblies." },
];

const checkpoints = ["Hole position", "Profile & trim line", "Gap & flush", "Flange angle"];

export function QualitySection({ awards }: { awards: Award[] }) {
  return (
    <section className="relative overflow-clip bg-bg py-24 sm:py-32">
      {/* faint precision grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_60%)]"
      />
      <Container className="relative">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Quality standards"
            title="Measured, gauged and signed off before it ships."
            body="Quality is built into the process at four gates, from the first off-tool sample to 3D laser scanning of production parts."
          />
          <Reveal delay={0.06} className="shrink-0">
            <Link
              href="/quality"
              className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-bg-elevated px-5 py-2.5 text-sm font-semibold text-fg shadow-soft transition-colors duration-300 hover:border-accent hover:text-accent-ink"
            >
              Quality process
              <ArrowUpRight size={14} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        {/* credential roundels */}
        <Reveal delay={0.08} className="mt-14">
          <div className="surface-metal rounded-[2rem] px-5 py-8 sm:px-10">
            <ul className="grid grid-cols-2 gap-6 sm:gap-8 lg:grid-cols-4">
              {badges.map((b) => (
                <li key={b.title} className="group flex flex-col items-center text-center">
                  <QualityBadge
                    title={b.title}
                    caption={b.caption}
                    className="h-auto w-28 drop-shadow-[0_18px_22px_rgb(13_17_20/0.35)] transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:rotate-[8deg] sm:w-36"
                  />
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-7 max-w-2xl text-center text-xs leading-relaxed text-fg-muted">
              ISO 9001 and ISO 14001 management systems are referenced in SAPL company materials; certificate numbers,
              revisions and validity dates will be published on the{" "}
              <Link href="/quality" className="font-medium text-accent-ink underline underline-offset-2">
                quality page
              </Link>{" "}
              once verified.
            </p>
          </div>
        </Reveal>

        <div className="mt-6 grid gap-6 lg:grid-cols-12">
          {/* inspection lab visual */}
          <Reveal from="scale" className="lg:col-span-7">
            <figure className="group relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-bg-inverted shadow-lift sm:aspect-[16/11]">
              <Image
                src="/images/facility/floor/panel-gauging.jpg"
                alt="Inspector in a Shaheen Automotive cap checking a clamped panel with a gauge"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="object-cover grayscale-[35%] transition-transform duration-[1.2s] ease-out group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-bg-inverted/90 via-bg-inverted/30 to-transparent" />
              <div className="blueprint-grid absolute inset-0 opacity-50" aria-hidden="true" />

              {/* scanning beam: the one perpetual motion here, reads as live metrology */}
              <div aria-hidden="true" className="absolute inset-0 opacity-0 [--scan-distance:100%] motion-safe:animate-[scan_4.5s_ease-in-out_infinite]">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-glow to-transparent shadow-[0_0_18px_4px_rgb(53_208_127/0.45)]" />
              </div>

              {/* reticle */}
              <div aria-hidden="true" className="absolute left-[58%] top-[38%] h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-glow/70">
                <span className="absolute left-1/2 top-[-10px] h-[calc(100%+20px)] w-px -translate-x-1/2 bg-glow/50" />
                <span className="absolute left-[-10px] top-1/2 h-px w-[calc(100%+20px)] -translate-y-1/2 bg-glow/50" />
              </div>

              <figcaption className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-7">
                <div>
                  <p className="tech-label text-glow">Inspection bay</p>
                  <p className="mt-1.5 font-display text-xl font-bold tracking-tight text-white sm:text-2xl">Gap check on the fixture</p>
                </div>
                <ul className="glass-dark rounded-2xl px-4 py-3">
                  <li className="tech-label mb-1.5 text-[10px] text-fg-inverted-muted">Checkpoints</li>
                  {checkpoints.map((c) => (
                    <li key={c} className="mono-figure flex items-center gap-2 py-0.5 text-xs text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-glow" />
                      {c}
                    </li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          </Reveal>

          {/* inspection gates */}
          <Reveal delay={0.1} className="lg:col-span-5">
            <ol className="relative h-full rounded-[2rem] border border-border bg-bg-elevated p-6 shadow-soft sm:p-8">
              <span aria-hidden="true" className="absolute bottom-14 left-[calc(1.5rem+19px)] top-14 w-px bg-gradient-to-b from-accent via-accent/40 to-transparent sm:left-[calc(2rem+19px)]" />
              {gates.map((g) => (
                <li key={g.code} className="group relative flex gap-5 py-4 first:pt-0 last:pb-0">
                  <span className="mono-figure relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-bg-inverted text-xs font-semibold text-glow shadow-[0_0_0_5px_var(--color-bg-elevated)] transition-transform duration-300 group-hover:scale-110">
                    {g.code}
                  </span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight text-fg">{g.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-fg-muted">{g.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>

        {/* OEM recognition */}
        <Reveal className="mt-16">
          <div className="flex items-center gap-4">
            <p className="tech-label shrink-0 text-fg-muted">Recognised by the OEMs we supply</p>
            <span className="h-px flex-1 bg-border" />
          </div>
          <ul className="-mx-5 mt-6 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:thin] sm:-mx-8 sm:scroll-px-8 sm:px-8 xl:mx-0 xl:grid xl:grid-cols-5 xl:overflow-visible xl:px-0 xl:pb-0">
            {awards.map((award) => (
              <li key={award.title + award.year} className="w-[min(15rem,78vw)] shrink-0 snap-start xl:w-auto">
                <article className="group flex h-full items-center gap-4 rounded-2xl border border-border bg-bg-elevated p-3 transition-[box-shadow,border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-accent/30 hover:shadow-lift">
                  <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl bg-bg-inverted">
                    {award.image && (
                      <Image
                        src={award.image}
                        alt={`${award.title}, ${award.awardedBy}`}
                        fill
                        sizes="56px"
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[11px] font-semibold text-accent-ink">
                      <Trophy size={12} weight="fill" />
                      {award.oem}
                    </p>
                    <h3 className="mt-0.5 line-clamp-2 text-sm font-semibold leading-snug text-fg">{award.title}</h3>
                    <p className="mono-figure text-[11px] text-fg-muted">{award.year}</p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
