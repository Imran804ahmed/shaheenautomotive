import { Container } from "@/components/ui/Container";
import { StatCounter } from "@/components/ui/StatCounter";
import { Reveal } from "@/components/ui/Reveal";
import type { StatItem } from "@/content/company";

/** Floats over the bottom edge of the hero so the two sections read as layers. */
export function StatsBand({ stats }: { stats: StatItem[] }) {
  return (
    <section className="relative z-10 -mt-20 sm:-mt-24">
      <Container>
        <Reveal>
          <div className="grid grid-cols-2 gap-y-8 rounded-[2rem] border border-border bg-bg-elevated px-6 py-8 shadow-lift sm:px-10 sm:py-10 lg:grid-cols-4 lg:gap-y-0 lg:divide-x lg:divide-border">
            {stats.map((stat) => (
              <div key={stat.label} className="lg:px-8 lg:first:pl-0 lg:last:pr-0">
                <p className="stat-figure text-3xl sm:text-4xl">
                  <StatCounter value={stat.value} />
                </p>
                <p className="stat-label mt-3 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
