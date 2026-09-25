"use client";

import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { HlsBackground } from "@/components/ui/HlsBackground";
import { siteConfig } from "@/content/site";
import { gsap } from "@/lib/gsap";
import { dist, dur, ease } from "@/lib/motion";
import { HeroScene } from "@/components/sections/HeroScene";

/** One headline word, rising out of a clipping mask. */
function Word({ children, index, className }: { children: React.ReactNode; index: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
      <motion.span
        initial={reduce ? false : { y: "105%", rotate: dist(3) }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ duration: dur(0.8), delay: 0.08 + index * 0.045, ease }}
        style={{ transformOrigin: "0% 100%" }}
        className={"inline-block will-change-transform " + (className ?? "")}
      >
        {children}
      </motion.span>
    </span>
  );
}

const headline: { word: string; accent?: boolean }[] = "Sheet metal, pipe and rod components, engineered for OEM production lines."
  .split(" ")
  .map((word) => ({ word, accent: word === "engineered" }));

export function Hero() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);

  // Scroll-scrubbed depth: copy and scene drift at different speeds as the hero leaves.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scrollTrigger = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to("[data-hero-copy]", { y: 70, ease: "none", scrollTrigger });
      gsap.to("[data-hero-scene]", { y: -60, ease: "none", scrollTrigger });
    }, root);
    return () => mm.revert();
  }, []);
  const enter = (delay: number) => ({
    initial: reduce ? (false as const) : { opacity: 0, y: dist(22) },
    animate: { opacity: 1, y: 0 },
    transition: { duration: dur(0.7), delay, ease },
  });

  return (
    <section ref={root} className="surface-ink -mt-[var(--header-h)] overflow-hidden rounded-b-[2.5rem] pb-32 sm:rounded-b-[3.5rem] sm:pb-40">
      {siteConfig.heroVideo.src && (
        <HlsBackground src={siteConfig.heroVideo.src} poster={siteConfig.heroVideo.poster || undefined} />
      )}
      <Container className="grid items-center gap-14 pt-[calc(var(--header-h)+2.5rem)] sm:gap-16 sm:pt-[calc(var(--header-h)+3rem)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-12 xl:gap-10 lg:pt-[calc(var(--header-h)+4.5rem)]">
        <div data-hero-copy className="@container">
          <motion.p
            {...enter(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium text-fg-inverted-muted backdrop-blur"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-glow" />
            Manufacturing in Pakistan since 1983
          </motion.p>
          <h1 className="mt-6 text-balance text-display-xl font-semibold text-fg-inverted">
              {headline.map((w, idx) => (
                <span key={idx}>
                  <Word index={idx} className={w.accent ? "text-brass-gradient" : undefined}>
                    {w.word}
                  </Word>
                  {idx < headline.length - 1 ? " " : null}
                </span>
              ))}
            </h1>
          <motion.p
            {...enter(0.14)}
            className="mt-6 max-w-lg text-base leading-relaxed text-fg-inverted-muted sm:text-lg"
          >
            Shaheen Automotive (Pvt.) Ltd. designs and manufactures precision components for automotive and home appliance OEMs, from tooling through mass production.
          </motion.p>
          <motion.div {...enter(0.22)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button href="/contact" variant="brass" className="w-full sm:w-auto">
              Request a Quote
            </Button>
            <Button href="/capabilities" variant="onDark" showArrow={false} className="w-full sm:w-auto">
              Explore Capabilities
            </Button>
          </motion.div>
        </div>

        <div data-hero-scene>
          <HeroScene />
        </div>
      </Container>
    </section>
  );
}
