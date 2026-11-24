import type { Award } from "@/content/company";
import { pageMetadata } from "@/lib/server/seo";
import { getContent } from "@/lib/server/content";
import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import Image from "next/image";
import { Clock, Leaf, SealCheck, ShieldCheck, Trophy } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { blurProps } from "@/lib/image-meta";
import { cn } from "@/lib/cn";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/quality", {
  title: "Quality",
  description:
    "How Shaheen Automotive verifies quality from OTS sample inspection through trial production and mass production, plus certifications and awards.",
  alternates: { canonical: "/quality" },
});
}

function AwardCard({ award }: { award: Award }) {
  return (
    <figure className="card-lift group flex h-full flex-col overflow-hidden rounded-[1.5rem] border border-border-inverted bg-bg-inverted shadow-soft">
      {/* light display stage, as on the home page: every award is a whole 3:4 print, never cropped */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(120%_75%_at_50%_0%,#ffffff,var(--color-bg)_70%)]">
        <div aria-hidden="true" className="absolute inset-x-10 bottom-7 h-6 rounded-[50%] bg-black/15 blur-xl" />
        {award.image && (
          <div className="absolute inset-0 flex items-center justify-center p-6 pb-8">
            {/* wide or square photos sit whole on a mat matched to their light-grey studio backdrop */}
            <div className="relative aspect-[3/4] h-full max-w-full overflow-hidden rounded-xl bg-[linear-gradient(to_bottom,rgb(221_228_234),rgb(229_236_240))] shadow-[0_18px_30px_-12px_rgb(0_0_0/0.45)] ring-1 ring-black/5 transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.04]">
              <Image
                src={award.image}
                alt={`${award.title}, ${award.awardedBy}`}
                fill
                sizes="(min-width: 1280px) 260px, (min-width: 1024px) 28vw, (min-width: 640px) 45vw, 85vw"
                {...blurProps(award.image)}
                className="object-contain"
              />
            </div>
          </div>
        )}
        {award.year && (
          <span className="mono-figure absolute left-3 top-3 rounded-full bg-brass px-2.5 py-1 text-[11px] font-semibold text-brass-fg shadow-soft">
            {award.year}
          </span>
        )}
      </div>
      <figcaption className="flex flex-1 flex-col gap-1.5 border-t border-border-inverted p-5">
        {(award.oem ?? award.issuer) && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brass">{award.oem ?? award.issuer}</span>
        )}
        <span className="text-sm font-semibold leading-snug text-fg-inverted">{award.title}</span>
        <span className="text-xs leading-relaxed text-fg-inverted-muted">{award.awardedBy}</span>
      </figcaption>
    </figure>
  );
}

const floorPhoto = (name: string) => `/images/facility/floor/${name}.jpg`;

/** The three quality gates, laid out like the plant areas on /facility. */
const qualityStages = [
  {
    key: "ots-inspection",
    number: "01",
    label: "OTS sample inspection",
    body: "Once tooling is complete, an off-tool sample is produced and inspected jointly by the SAPL quality team and the customer's quality department before the part is approved.",
    cover: floorPhoto("checking-fixture-closeup"),
    coverAlt: "Inspector checking a stamped part on a clamped checking fixture",
    facts: [
      { name: "Stage", value: "Tooling sign-off" },
      { name: "Inspected by", value: "SAPL + customer QA" },
    ],
  },
  {
    key: "line-verification",
    number: "02",
    label: "Trial production & line verification",
    body: "A line verification process is run in the presence of the customer's team, confirming the production line is ready for volume before mass production begins.",
    cover: floorPhoto("press-line-safety-gear"),
    coverAlt: "Operators in hard hats, safety glasses and high-visibility vests running a line of mechanical power presses",
    facts: [
      { name: "Stage", value: "Pre-volume" },
      { name: "Witnessed by", value: "Customer team on-site" },
    ],
  },
  {
    key: "production-qa",
    number: "03",
    label: "Production quality assurance",
    body: "Once in mass production, parts are checked on gauging fixtures through the run and delivered against schedule with consistent quality.",
    cover: floorPhoto("panel-gauging"),
    coverAlt: "Inspector clamping a sheet metal part into a gauging fixture",
    facts: [
      { name: "Stage", value: "Mass production" },
      { name: "Delivery", value: "Against schedule" },
    ],
  },
];

const isoStandards = [
  { code: "ISO 9001", name: "Quality management system", icon: ShieldCheck },
  { code: "ISO 14001", name: "Environmental management system", icon: Leaf },
];

export default async function QualityPage() {
  const { pageHeaders, certificationsNote, namedAwards, awardPhotos } = await getContent();
  const awardGroups = [
    { title: "Performance & appreciation awards", items: awardPhotos.filter((a) => a.category === "award") },
    { title: "Supplier conventions & certificates", items: awardPhotos.filter((a) => a.category === "recognition") },
  ];
  return (
    <>
      <PageHeader {...pageHeaders.quality} flat />

      <section className="surface-paper bg-bg py-section">
        <Container className="space-y-16 sm:space-y-24 lg:space-y-28">
          {qualityStages.map((stage, i) => (
            <div key={stage.key} id={stage.key} className="grid scroll-mt-28 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal from={i % 2 ? "right" : "left"} className={cn(i % 2 && "lg:order-2")}>
                <ParallaxImage
                  src={stage.cover}
                  alt={stage.coverAlt}
                  sizes="(min-width: 1280px) 720px, (min-width: 1024px) 50vw, 100vw"
                  blurDataURL={blurProps(stage.cover).blurDataURL}
                  className="aspect-[4/3] rounded-[2rem] shadow-lift ring-1 ring-border"
                />
              </Reveal>

              <Reveal delay={0.08}>
                <p className="mono-figure text-4xl font-semibold text-accent/25 sm:text-6xl">{stage.number}</p>
                <h2 className="mt-3 text-display-md font-semibold tracking-tight text-fg">{stage.label}</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">{stage.body}</p>

                <dl className="mt-8 grid max-w-md grid-cols-2 gap-2 sm:gap-3">
                  {stage.facts.map((f) => (
                    <div key={f.name} className="min-w-0 rounded-2xl border border-border bg-bg-elevated p-3 shadow-soft sm:p-4">
                      <dt className="text-[11px] leading-snug text-fg-muted sm:text-xs">{f.name}</dt>
                      <dd className="mt-2 text-sm font-semibold leading-snug text-fg sm:text-base">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-bg pb-section-sm">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-border bg-bg-elevated p-6 shadow-soft sm:p-10 lg:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-14">
              <div>
                <Eyebrow className="mb-4">Certifications</Eyebrow>
                <h2 className="text-balance text-display-md font-semibold tracking-tight text-fg">{certificationsNote.headline}</h2>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base">{certificationsNote.body}</p>
                <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-brass/40 bg-brass-soft/40 px-3.5 py-1.5 text-xs font-medium text-fg">
                  <Clock size={14} weight="bold" className="text-brass" />
                  Certificate details pending verification
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
                {isoStandards.map((std) => (
                  <div key={std.code} className="flex flex-col rounded-[1.5rem] border border-border bg-bg p-5 sm:p-6">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-fg shadow-soft">
                      <std.icon size={22} weight="duotone" />
                    </span>
                    <p className="mono-figure mt-5 text-2xl font-semibold text-fg">{std.code}</p>
                    <p className="mt-1 text-sm leading-snug text-fg-muted">{std.name}</p>
                  </div>
                ))}
                <div className="flex items-center gap-3 rounded-[1.5rem] border border-dashed border-border px-5 py-4 sm:col-span-2">
                  <SealCheck size={20} weight="duotone" className="shrink-0 text-accent" />
                  <p className="text-sm text-fg-muted">
                    Certified under <span className="font-semibold text-fg">UKAS</span>, Pakistan
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="rounded-section bg-bg-elevated shadow-soft py-section-sm">
        <Container>
          <Reveal className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <Eyebrow rule="bg-brass" className="mb-4">
                Recognition
              </Eyebrow>
              <h2 className="text-display-md font-semibold tracking-tight text-fg">
                Awards & recognition
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-fg-muted">
                Awards, appreciation certificates and supplier-convention recognition presented to SAPL by its OEM customers and industry bodies between 2000 and 2024.
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-border bg-bg px-5 py-4">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brass-soft text-brass-fg">
                <Trophy size={22} weight="duotone" />
              </span>
              <div>
                <p className="mono-figure text-lg font-semibold text-fg">1998 – 2024</p>
                <p className="text-xs text-fg-muted">Toyota, Suzuki, Hino, Hyundai / Kia, Changan, Chevrolet</p>
              </div>
            </div>
          </Reveal>

          {awardGroups.map((group) => (
            <div key={group.title} className="mt-12">
              <Reveal className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                <h3 className="text-base font-semibold uppercase tracking-[0.14em] text-fg sm:text-lg">{group.title}</h3>
                <span className="mono-figure text-sm text-fg-muted">{String(group.items.length).padStart(2, "0")}</span>
              </Reveal>
              <RevealGroup className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {group.items.map((award) => (
                  <RevealItem key={award.title + award.year}>
                    <AwardCard award={award} />
                  </RevealItem>
                ))}
              </RevealGroup>
            </div>
          ))}

          <Reveal className="mt-12">
            <ul className="divide-y divide-border overflow-hidden rounded-[1.25rem] border border-border bg-bg">
              {namedAwards.map((a) => (
                <li
                  key={a.title + a.year}
                  className="grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 px-5 py-4 sm:grid-cols-[7rem_1fr_auto]"
                >
                  <span className="mono-figure row-span-2 text-sm font-semibold text-accent sm:row-span-1">{a.year}</span>
                  <span className="text-sm font-medium text-fg">{a.title}</span>
                  <span className="col-start-2 text-xs text-fg-muted sm:col-start-3 sm:text-right">{a.awardedBy}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
