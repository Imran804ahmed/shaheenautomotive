import Image from "next/image";
import { blurProps, imageSize } from "@/lib/image-meta";
import { ArrowUpRight, Trophy } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotTrack } from "@/components/ui/SpotTrack";
import type { Award } from "@/content/company";

export function QualityEvidence({ awards }: { awards: Award[] }) {
  const years = awards.flatMap((a) => (a.year ? a.year.match(/\d{4}/g) ?? [] : [])).map(Number);
  const first = Math.min(...years);
  const last = Math.max(...years, new Date().getFullYear());
  const oems = new Set(awards.map((a) => a.oem).filter(Boolean)).size;
  // stats cover the full record; the cards show only the featured pieces
  const featured = awards.filter((a) => a.featured);

  return (
    <section className="bg-bg-elevated py-section shadow-soft">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Quality"
            title="Recognition from the OEMs we manufacture for."
            body="Supplier awards for delivery, development and overall performance, presented at OEM supplier conventions."
          />
          <Reveal delay={0.06} className="shrink-0">
            <Button href="/quality" variant="secondary" showArrow={false}>
              Quality process
              <ArrowUpRight size={15} weight="bold" />
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <dl className="mt-10 grid grid-cols-1 divide-y divide-border overflow-hidden sm:grid-cols-3 sm:divide-x sm:divide-y-0 rounded-[1.25rem] border border-border bg-bg">
            {[
              { value: String(awards.length), label: "Awards & certificates" },
              { value: String(oems), label: "OEM groups" },
              { value: `${first}–${last}`, label: "Years of recognition" },
            ].map((s) => (
              <div key={s.label} className="flex items-baseline justify-between gap-4 px-5 py-3.5 sm:block sm:px-6 sm:py-5">
                <dt className="text-[11px] font-medium uppercase tracking-[0.14em] text-fg-muted sm:text-xs">{s.label}</dt>
                <dd className="stat-figure text-2xl sm:mt-1.5 sm:text-3xl">{s.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <div className="-mx-5 mt-8 flex snap-x snap-mandatory scroll-px-5 gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:thin] sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {featured.map((award, i) => (
            <Reveal
              key={award.title + award.year}
              delay={i * 0.05}
              className="w-[240px] shrink-0 snap-start sm:w-[260px] lg:w-auto"
            >
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border bg-bg shadow-soft transition-[box-shadow,border-color,transform] duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift motion-reduce:hover:translate-y-0">
                {/* light display stage: every award sits on the same backdrop, framed like a print */}
                <SpotTrack className="relative aspect-[4/5] w-full overflow-hidden bg-[radial-gradient(120%_75%_at_50%_0%,#ffffff,var(--color-bg)_70%)]">
                  <div
                    aria-hidden="true"
                    className="absolute inset-x-8 bottom-6 h-6 rounded-[50%] bg-black/15 blur-xl"
                  />
                  {award.image && (
                    <div className="absolute inset-0 flex items-center justify-center p-5 pb-7">
                      <Image
                        src={award.image}
                        alt={`${award.title}, ${award.awardedBy}`}
                        // real aspect ratio, so the framed print doesn't jump when it loads
                        {...(imageSize(award.image) ?? { width: 800, height: 800 })}
                        sizes="(min-width: 1280px) 240px, (min-width: 1024px) 20vw, 260px"
                        {...blurProps(award.image)}
                        className="h-auto max-h-full w-auto max-w-full rounded-xl shadow-[0_18px_30px_-12px_rgb(0_0_0/0.45)] ring-1 ring-black/5 transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none"
                      />
                    </div>
                  )}
                  <span className="spot-glow" aria-hidden="true" />
                  {award.year && (
                    <span className="mono-figure absolute left-3 top-3 rounded-full border border-border bg-bg-elevated/85 px-2.5 py-1 text-[11px] font-medium text-fg shadow-soft backdrop-blur-md">
                      {award.year}
                    </span>
                  )}
                </SpotTrack>
                <div className="flex flex-1 flex-col border-t border-border px-4 pb-4 pt-4">
                  {award.oem && (
                    <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-semibold text-accent-strong">
                      <Trophy size={12} weight="fill" className="text-brass" />
                      {award.oem}
                    </span>
                  )}
                  <h3 className="mt-3 text-[0.95rem] font-semibold leading-snug text-fg">{award.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-fg-muted">{award.awardedBy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
