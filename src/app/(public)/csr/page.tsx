import { getPageImages } from "@/lib/server/website-images";
import { pageImageKey } from "@/lib/server/website-image-inventory";
import { pageMetadata } from "@/lib/server/seo";
import { getContent } from "@/lib/server/content";
import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowDown,
  CheckCircle,
  Factory,
  GraduationCap,
  HardHat,
  Leaf,
  Quotes,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { blurProps } from "@/lib/image-meta";
import { cn } from "@/lib/cn";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/csr", {
  title: "Corporate Social Responsibility",
  description:
    "How Shaheen Automotive approaches corporate social responsibility: workplace safety, training and skills development, environmental management and supporting local manufacturing in Pakistan.",
  alternates: { canonical: "/csr" },
});
}

const areaIcons: Record<string, PhosphorIcon> = {
  "workplace-safety": HardHat,
  training: GraduationCap,
  environment: Leaf,
  "local-industry": Factory,
};

export default async function CsrPage() {
  const images = await getPageImages("csr");
  const { pageHeaders, csrAreas: originalAreas, csrIntro } = await getContent();
  const csrAreas = originalAreas.map((area) => {
    const image = images[pageImageKey("csr", area.key)];
    return image?.src ? { ...area, image: image.src, imageAlt: image.alt } : area;
  });
  return (
    <>
      <PageHeader {...pageHeaders.csr} image={ { ...pageHeaders.csr.image, src: images[pageImageKey("csr", "banner")]?.src || pageHeaders.csr.image.src } } flat />

      <section className="bg-bg pt-section-sm">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-border bg-bg-elevated p-6 shadow-soft sm:p-10 lg:p-14">
            <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="relative grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
              <div>
                <Eyebrow className="mb-6">Our commitment</Eyebrow>
                <Quotes size={44} weight="fill" aria-hidden="true" className="text-brass" />
                <h2 className="mt-4 text-balance text-display-md font-semibold tracking-tight text-fg">
                  What is good for our people is good for our business.
                </h2>
              </div>
              <div className="space-y-4 border-border lg:border-l lg:pl-16">
                {csrIntro.map((p) => (
                  <p key={p.slice(0, 24)} className="text-base leading-relaxed text-fg-muted sm:text-lg">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>

          <RevealGroup className="mt-5 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-4">
            {csrAreas.map((area) => {
              const Icon = areaIcons[area.key] ?? CheckCircle;
              return (
                <RevealItem key={area.key} className="h-full">
                  <a
                    href={`#${area.key}`}
                    className="group flex h-full flex-col rounded-[1.5rem] border border-border bg-bg-elevated p-5 shadow-soft transition-[box-shadow,border-color,transform] duration-300 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lift motion-reduce:hover:translate-y-0 sm:p-6"
                  >
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-fg shadow-soft">
                      <Icon size={22} weight="duotone" />
                    </span>
                    <h3 className="mt-5 text-base font-semibold tracking-tight text-fg">{area.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">{area.summary}</p>
                    <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs font-semibold text-accent">
                      Learn more
                      <ArrowDown size={14} weight="bold" className="transition-transform duration-300 group-hover:translate-y-0.5" />
                    </span>
                  </a>
                </RevealItem>
              );
            })}
          </RevealGroup>
        </Container>
      </section>

      <section className="surface-paper bg-bg py-section">
        <Container className="space-y-16 sm:space-y-24 lg:space-y-28">
          {csrAreas.map((area, i) => (
            <div key={area.key} id={area.key} className="grid scroll-mt-28 items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-16">
              <Reveal from={i % 2 ? "right" : "left"} className={cn(i % 2 && "lg:order-2")}>
                {area.fit === "contain" ? (
                  // certificates are shown whole on a light mat, never cropped
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-[radial-gradient(120%_75%_at_50%_0%,#ffffff,var(--color-bg)_70%)] shadow-lift ring-1 ring-border">
                    <div className="absolute inset-0 p-6 sm:p-10">
                      <div className="relative h-full w-full">
                        <Image
                          src={area.image}
                          alt={area.imageAlt}
                          fill
                          sizes="(min-width: 1280px) 600px, (min-width: 1024px) 40vw, 90vw"
                          {...blurProps(area.image)}
                          className="object-contain drop-shadow-[0_18px_24px_rgb(0_0_0/0.25)]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <ParallaxImage
                    src={area.image}
                    alt={area.imageAlt}
                    sizes="(min-width: 1280px) 720px, (min-width: 1024px) 50vw, 100vw"
                    blurDataURL={blurProps(area.image).blurDataURL}
                    className="aspect-[4/3] rounded-[2rem] shadow-lift ring-1 ring-border"
                  />
                )}
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="text-display-md font-semibold tracking-tight text-fg">{area.label}</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">{area.body}</p>
                <ul className="mt-8 max-w-xl space-y-3">
                  {area.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-relaxed text-fg sm:text-base">
                      <CheckCircle size={20} weight="duotone" className="mt-0.5 shrink-0 text-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-bg pb-section">
        <Container>
          <Reveal className="relative overflow-hidden rounded-[2rem] bg-bg-inverted p-8 text-center shadow-lift sm:p-12">
            <div aria-hidden="true" className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-accent/25 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="text-balance text-display-md font-semibold tracking-tight text-fg-inverted">
                Partner with a responsible manufacturer.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-fg-inverted-muted sm:text-lg">
                Talk to our team about your component programme, or about how we work on safety, training and the environment.
              </p>
              <div className="mt-8 flex justify-center">
                <Button href="/contact" variant="brass">
                  Contact Us
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
