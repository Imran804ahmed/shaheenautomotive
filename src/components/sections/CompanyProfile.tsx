import Link from "next/link";
import { GearSix, Factory, Crosshair, SteeringWheel, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal } from "@/components/ui/Reveal";
import { SpotTrack } from "@/components/ui/SpotTrack";
import { StatCounter } from "@/components/ui/StatCounter";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pressShopTotal, awardPhotos } from "@/content/company";

const FOUNDED = 1983;

type ProfileCard = {
  icon: Icon;
  label: string;
  value: string;
  unit: string;
  body: string;
  spec: string;
};

/**
 * OEM-style company profile: one large plant photograph, a technical inset,
 * and the four headline credentials as instrument-style cards.
 */
export function CompanyProfile() {
  const years = new Date().getFullYear() - FOUNDED;

  const cards: ProfileCard[] = [
    {
      icon: GearSix,
      label: "Years of experience",
      value: `${years}`,
      unit: "years",
      body: "Founded in July 1983 as Shaheen Engineering Works, now a private limited OEM supplier.",
      spec: `Est. ${FOUNDED}`,
    },
    {
      icon: Factory,
      label: "Production capability",
      value: "100–120",
      unit: "tons / month",
      body: `${pressShopTotal.machines} presses from 15 to 300 tons, plus NC/CNC pipe bending and in-house welding shops.`,
      spec: "350+ parts in production",
    },
    {
      icon: Crosshair,
      label: "Quality commitment",
      value: `${awardPhotos.length}`,
      unit: "OEM supplier awards",
      body: "FARO arm laser scanning and checking fixtures, with off-tool samples signed off by both SAPL and the customer.",
      spec: "Suzuki · Kia · Toyota",
    },
    {
      icon: SteeringWheel,
      label: "Industry expertise",
      value: "8+",
      unit: "OEM programmes",
      body: "Passenger cars, motorcycles and home appliances, from die design through to mass production.",
      spec: "200+ projects delivered",
    },
  ];

  return (
    <section id="company" className="surface-paper relative bg-bg py-24 sm:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading
              eyebrow="Company profile"
              title="Four decades inside Pakistan's automotive supply chain."
              body="SAPL designs, tools and manufactures the stamped, bent and formed parts that go into vehicles and appliances built by the country's leading OEMs, all under one roof."
            />
            <Reveal delay={0.1} className="mt-8">
              <Link
                href="/about"
                className="group inline-flex items-center gap-2 text-sm font-semibold text-accent-ink transition-colors hover:text-accent-strong"
              >
                About Shaheen Automotive
                <ArrowUpRight size={15} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>

          {/* plant photograph with an inset detail and a spec tag, layered for depth */}
          <div className="relative lg:col-span-7">
            <Reveal from="scale">
              <div className="relative">
                <ParallaxImage
                  src="/images/facility/floor/press-row.jpg"
                  alt="Operators working at a row of mechanical presses of different tonnages"
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="aspect-[16/10] rounded-[2rem] shadow-lift"
                />
                <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-black/5" />
                <div className="glass-light absolute left-4 top-4 rounded-2xl px-4 py-3 sm:left-6 sm:top-6">
                  <p className="tech-label text-fg-muted">Press shop</p>
                  <p className="mt-1 font-display text-lg font-bold tracking-tight text-fg">15&ndash;300 T fleet</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.15} className="absolute -bottom-10 -left-4 hidden w-[38%] sm:block lg:-left-12">
              <ParallaxImage
                src="/images/facility/floor/checking-fixture-closeup.jpg"
                alt="Gloved inspector seating a panel against the locators of a checking fixture"
                sizes="22vw"
                className="aspect-[4/5] rounded-[1.5rem] border-[6px] border-bg shadow-deep"
              />
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.label} delay={i * 0.07} className="h-full">
                <SpotTrack className="group card-lift surface-metal relative flex h-full flex-col overflow-hidden rounded-[1.75rem] p-6 sm:p-7">
                  <div className="flex items-start justify-between">
                    <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-inverted text-glow shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_10px_20px_-10px_rgb(0_0_0/0.6)]">
                      <Icon size={24} weight="duotone" />
                    </span>
                    <span className="mono-figure text-[11px] text-fg-muted">{String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <p className="tech-label mt-8 text-fg-muted">{card.label}</p>
                  <p className="mt-2 whitespace-nowrap">
                    <span className="stat-figure text-[2.5rem]">
                      <StatCounter value={card.value} />
                    </span>
                  </p>
                  <p className="mt-1.5 text-sm font-medium text-fg">{card.unit}</p>
                  <p className="mt-4 text-sm leading-relaxed text-fg-muted">{card.body}</p>
                  <div className="mt-auto pt-6">
                    <div className="metal-rule" />
                    <p className="mono-figure mt-4 flex items-center gap-2 text-xs text-fg">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {card.spec}
                    </p>
                  </div>
                  <span className="spot-glow" aria-hidden="true" />
                  <span className="spot-border" aria-hidden="true" />
                </SpotTrack>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
