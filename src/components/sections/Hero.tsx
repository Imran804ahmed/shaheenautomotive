"use client";

import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BackdropImage } from "@/components/ui/BackdropImage";
import { HlsBackground } from "@/components/ui/HlsBackground";
import { siteConfig } from "@/content/site";
import { dist, dur, ease } from "@/lib/motion";

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

const headline: { word: string; accent?: boolean }[] = "Jacks, Sheet Metal, Rods and Pipes, engineered for OEM production lines."
  .split(" ")
  .map((word) => ({ word, accent: word === "engineered" }));

export function Hero() {
  const reduce = useReducedMotion();
  const enter = (delay: number) => ({
    initial: reduce ? (false as const) : { opacity: 0, y: dist(22) },
    animate: { opacity: 1, y: 0 },
    transition: { duration: dur(0.7), delay, ease },
  });

  return (
    <section className="relative isolate -mt-[var(--header-h)] flex min-h-[100dvh] items-center overflow-hidden rounded-b-section bg-bg-inverted pb-24 sm:pb-32">
      {/* full-bleed plant exterior, kept bright; only the copy side is darkened */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0">
          <BackdropImage src="/images/facility/exterior/shaheen-plant-exterior.webp" position="62% center" priority />
        </div>
        {siteConfig.heroVideo.src && (
          <div className="absolute inset-0 isolate">
            <HlsBackground src={siteConfig.heroVideo.src} poster={siteConfig.heroVideo.poster || undefined} />
          </div>
        )}
        {/* dark on the copy side, opening up towards the right */}
        <div className="scrim-hero" />
        <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg-inverted via-bg-inverted/50 to-transparent" />
      </div>

      <Container className="w-full pt-[calc(var(--header-h)+2.5rem)] sm:pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+4.5rem)]">
        <div className="@container max-w-3xl">
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
              Contact Us
            </Button>
            <Button href="/capabilities" variant="onDark" showArrow={false} className="w-full sm:w-auto">
              Explore Capabilities
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
