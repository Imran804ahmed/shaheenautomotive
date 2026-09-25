import Image from "next/image";
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
  const last = Math.max(...years);
  const oems = new Set(awards.map((a) => a.oem).filter(Boolean)).size;

  return (
    <section className="rounded-[2.5rem] bg-bg-elevated py-20 shadow-soft sm:rounded-[3.5rem] sm:py-28">
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
              { value: String(awards.length), label: "Supplier awards" },
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
          {awards.map((award, i) => (
            <Reveal
              key={award.title + award.year}
              delay={i * 0.05}
              className="w-[240px] shrink-0 snap-start sm:w-[260px] lg:w-auto"
            >
              <article className="group flex h-full flex-col rounded-[1.5rem] border border-border bg-bg p-2 transition-[box-shadow,border-color] duration-300 hover:border-accent/30 hover:shadow-lift">
                <SpotTrack className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.1rem] bg-bg-inverted">
                  {award.image && (
                    <>
                      {/* Blurred copy fills the frame so every photo, whatever its crop, sits on a matching backdrop. */}
                      <Image
                        src={award.image}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="120px"
                        className="scale-125 object-cover opacity-60 blur-2xl"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-bg-inverted/10 via-transparent to-bg-inverted/60" />
                      <Image
                        src={award.image}
                        alt={`${award.title}, ${award.awardedBy}`}
                        fill
                        sizes="(min-width: 1024px) 20vw, 260px"
                        className="object-contain p-3 drop-shadow-[0_18px_24px_rgb(0_0_0/0.45)] transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </>
                  )}
                  <span className="spot-glow" aria-hidden="true" />
                  {award.year && (
                    <span className="mono-figure absolute left-3 top-3 rounded-full bg-bg-inverted/60 px-2.5 py-1 text-[11px] font-medium text-fg-inverted backdrop-blur-md">
                      {award.year}
                    </span>
                  )}
                  {award.oem && (
                    <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brass px-2.5 py-1 text-[11px] font-semibold text-brass-fg">
                      <Trophy size={12} weight="fill" />
                      {award.oem}
                    </span>
                  )}
                </SpotTrack>
                <div className="px-2.5 pb-2.5 pt-4">
                  <h3 className="text-sm font-semibold leading-snug text-fg">{award.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-snug text-fg-muted">{award.awardedBy}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
