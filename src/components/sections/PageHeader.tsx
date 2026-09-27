import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { MetalDial } from "@/components/ui/MetalDial";

/**
 * Graphite page opener shared by every inner page. Slides under the
 * transparent header; an optional plant photograph sits behind a heavy
 * graphite grade, echoing the home hero at a smaller scale.
 */
export function PageHeader({
  title,
  intro,
  eyebrow,
  image,
  children,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  image?: { src: string; alt: string };
  children?: React.ReactNode;
}) {
  return (
    <section className="surface-ink grain relative -mt-[var(--header-h)] overflow-hidden pb-16 pt-[calc(var(--header-h)+4rem)] sm:pb-24 sm:pt-[calc(var(--header-h)+6rem)]">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image src={image.src} alt={image.alt} fill priority sizes="100vw" className="object-cover grayscale-[70%] contrast-125 brightness-50" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_13_15/0.95)_0%,rgb(10_13_15/0.8)_45%,rgb(10_13_15/0.45)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(45rem_28rem_at_85%_10%,rgb(4_148_72/0.3),transparent_65%)] mix-blend-screen" />
        </div>
      )}
      <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_80%_30%,black,transparent_70%)]" />
      <MetalDial className="pointer-events-none absolute -right-40 top-10 -z-10 h-auto w-[30rem] opacity-25 motion-safe:animate-spin-slow sm:w-[40rem] lg:-right-24 lg:opacity-35" />
      <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      <Container className="relative">
        <Reveal>
          {eyebrow && (
            <p className="tech-label mb-6 flex items-center gap-3 text-glow">
              <span className="h-px w-10 bg-gradient-to-r from-glow to-transparent" />
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-4xl text-balance text-display-lg text-fg-inverted">{title}</h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.08}>
            <p className="mt-7 max-w-2xl text-base leading-relaxed text-fg-inverted-muted sm:text-lg">{intro}</p>
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
