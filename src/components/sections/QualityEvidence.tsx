import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Award } from "@/content/company";

export function QualityEvidence({ awards }: { awards: Award[] }) {
  return (
    <section className="rounded-[2.5rem] bg-bg-elevated py-20 shadow-soft sm:rounded-[3.5rem] sm:py-28">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Quality" title="Recognition from the OEMs we manufacture for." />
          <Reveal delay={0.06}>
            <Button href="/quality" variant="secondary" showArrow={false} className="shrink-0">
              Quality process
              <ArrowUpRight size={15} weight="bold" />
            </Button>
          </Reveal>
        </div>

        <div className="-mx-5 mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:mx-0 sm:px-0 [scrollbar-width:thin]">
          {awards.map((award, i) => (
            <Reveal
              key={award.title + award.year}
              delay={i * 0.05}
              className="w-[230px] shrink-0 snap-start sm:w-[250px]"
            >
              <div className="card-lift relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] border border-border bg-bg shadow-soft">
                {award.image && (
                  <Image
                    src={award.image}
                    alt={`${award.title}, ${award.awardedBy}`}
                    fill
                    sizes="250px"
                    className="object-contain p-4"
                  />
                )}
              </div>
              <p className="mt-4 text-sm font-semibold leading-snug text-fg">{award.title}</p>
              <p className="mt-0.5 text-xs leading-snug text-fg-muted">
                {award.awardedBy}
                {award.year ? ` · ${award.year}` : ""}
              </p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
