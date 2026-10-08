import type { Metadata } from "next";
import { Eyebrow } from "@/components/ui/Eyebrow";
import Image from "next/image";
import { CheckCircle, SealWarning, Trophy } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { blurProps } from "@/lib/image-meta";
import {
  certificationsNote,
  namedAwards,
  awardPhotos,
  equipmentInspection,
  type Award,
} from "@/content/company";

export const metadata: Metadata = {
  title: "Quality",
  description:
    "How Shaheen Automotive verifies quality from OTS sample inspection through trial production and mass production, plus certifications and awards.",
  alternates: { canonical: "/quality" },
};

const awardGroups = [
  { title: "Performance & appreciation awards", items: awardPhotos.filter((a) => a.category === "award") },
  { title: "Supplier conventions & certificates", items: awardPhotos.filter((a) => a.category === "recognition") },
];

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

const checkpoints = [
  {
    stage: "Tooling sign-off",
    title: "OTS sample inspection",
    body: "Once tooling is complete, an off-tool sample is produced and inspected jointly by the SAPL quality team and the customer's quality department before the part is approved.",
    tag: "SAPL QA + customer QA",
    image: { src: floorPhoto("checking-fixture-closeup"), position: "50% 55%", alt: "Inspector checking a stamped part on a clamped checking fixture" },
  },
  {
    stage: "Pre-volume",
    title: "Trial production & line verification",
    body: "A line verification process is run in the presence of the customer's team, confirming the production line is ready for volume before mass production begins.",
    tag: "Customer team on-site",
    image: { src: floorPhoto("press-line-safety-gear"), position: "50% 50%", alt: "Operators in hard hats, safety glasses and high-visibility vests running a line of mechanical power presses" },
  },
  {
    stage: "Mass production",
    title: "Production quality assurance",
    body: "Once in mass production, parts are delivered against schedule with consistent quality checks maintained through the run.",
    tag: "Scheduled delivery",
    image: { src: floorPhoto("parts-racks"), position: "40% 60%", alt: "Finished parts staged in bins and racks for delivery" },
  },
];

export default function QualityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Quality"
        title="Quality verified at every stage, not just at the end."
        intro="From the first off-tool sample through trial production and into mass production, every part is checked against customer and SAPL quality requirements before it ships."
        image={{
          src: "/images/quality/hero/panel-gauging-green.webp",
          position: "70% 30%",
        }}
        flat
      />

      <section className="bg-bg py-section-sm">
        <Container>
          <RevealGroup className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-3">
            {checkpoints.map((c, i) => (
              <RevealItem key={c.title} className="h-full">
                <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-border bg-bg-elevated shadow-soft transition-[box-shadow,border-color,transform] duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift motion-reduce:hover:translate-y-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-bg">
                    <Image
                      src={c.image.src}
                      alt={c.image.alt}
                      fill
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 100vw"
                      {...blurProps(c.image.src)}
                      style={{ objectPosition: c.image.position }}
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_26_19/0.35)_0%,transparent_32%,transparent_55%,rgb(10_26_19/0.78)_100%)]"
                    />
                    <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/30 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-md">
                      {c.stage}
                    </span>
                    <span className="mono-figure absolute bottom-3 right-5 text-5xl font-semibold leading-none text-white/90 drop-shadow-[0_2px_12px_rgb(0_0_0/0.4)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-fg shadow-lift ring-4 ring-white/15">
                      <CheckCircle size={22} weight="bold" />
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6 sm:p-7">
                    <h3 className="text-lg font-semibold tracking-tight text-fg">{c.title}</h3>
                    <p className="mb-6 mt-2.5 text-sm leading-relaxed text-fg-muted">{c.body}</p>
                    <div className="mt-auto flex items-center gap-2 border-t border-border pt-4 text-xs font-medium text-accent-strong">
                      <span className="h-1.5 w-1.5 rounded-full bg-brass" aria-hidden="true" />
                      {c.tag}
                    </div>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </section>

      <section className="rounded-section bg-bg-elevated shadow-soft py-section-sm">
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

      <section className="bg-bg py-section-sm">
        <Container>
          <Reveal className="max-w-2xl rounded-sm border border-border bg-bg-elevated shadow-soft p-7">
            <SealWarning size={24} className="text-fg-muted" />
            <h2 className="mt-4 text-xl font-semibold tracking-tight text-fg">{certificationsNote.headline}</h2>
            <p className="mt-3 text-sm leading-relaxed text-fg-muted">{certificationsNote.body}</p>
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
                <p className="mono-figure text-lg font-semibold text-fg">2000 – 2024</p>
                <p className="text-xs text-fg-muted">Toyota, Suzuki, Hino</p>
              </div>
            </div>
          </Reveal>

          {awardGroups.map((group) => (
            <div key={group.title} className="mt-12">
              <Reveal className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
                <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">{group.title}</h3>
                <span className="mono-figure text-xs text-fg-muted">{String(group.items.length).padStart(2, "0")}</span>
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-fg-muted">Also cited in the company profile</h3>
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-[1.25rem] border border-border bg-bg">
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
