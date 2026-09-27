"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { ArrowDown } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { HlsBackground } from "@/components/ui/HlsBackground";
import { MetalDial } from "@/components/ui/MetalDial";
import { StatCounter } from "@/components/ui/StatCounter";
import { siteConfig } from "@/content/site";
import { heroStats } from "@/content/company";
import { gsap } from "@/lib/gsap";
import { dist, dur, ease } from "@/lib/motion";

const HERO_IMAGE = {
  src: "/images/facility/floor/press-shop-hall.jpg",
  alt: "The SAPL press shop hall: rows of mechanical presses, operators and stacked sheet metal blanks",
};

/** One headline word, rising out of a clipping mask. */
function Word({ children, index, className }: { children: React.ReactNode; index: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
      <motion.span
        initial={reduce ? false : { y: "105%" }}
        animate={{ y: 0 }}
        transition={{ duration: dur(0.9), delay: 0.15 + index * 0.07, ease }}
        className={"inline-block will-change-transform " + (className ?? "")}
      >
        {children}
      </motion.span>
    </span>
  );
}

const lines: { words: string[]; metal?: boolean }[] = [
  { words: ["Engineering", "excellence."] },
  { words: ["Driving", "the", "future."], metal: true },
];

export function Hero() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);

  // pointer tilt for the dial: motion values only, no React state
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18, mass: 0.8 });
  const sy = useSpring(py, { stiffness: 60, damping: 18, mass: 0.8 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-26, -6]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [16, 4]);

  // Scroll-scrubbed depth: the photo sinks slower than the page, the copy
  // lifts away and the dial keeps turning, so leaving the hero feels layered.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const scrollTrigger = { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.6 };
      gsap.to("[data-hero-bg]", { yPercent: 18, scale: 1.08, ease: "none", scrollTrigger });
      gsap.to("[data-hero-copy]", { y: -80, opacity: 0.2, ease: "none", scrollTrigger });
      gsap.to("[data-hero-dial]", { rotate: 50, y: 60, ease: "none", scrollTrigger });
    }, root);
    return () => mm.revert();
  }, []);

  const enter = (delay: number) => ({
    initial: reduce ? (false as const) : { opacity: 0, y: dist(22) },
    animate: { opacity: 1, y: 0 },
    transition: { duration: dur(0.8), delay, ease },
  });

  let wordIndex = 0;

  return (
    <section
      ref={root}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        px.set(e.clientX / window.innerWidth - 0.5);
        py.set(e.clientY / window.innerHeight - 0.5);
      }}
      className="grain relative isolate -mt-[var(--header-h)] flex min-h-[100dvh] flex-col overflow-hidden bg-bg-inverted text-fg-inverted"
    >
      {/* ---- cinematic background ---- */}
      <div className="absolute inset-0 -z-10">
        {/* GSAP owns the outer transform (scroll parallax), Motion the inner (load-in settle) */}
        <div data-hero-bg className="absolute inset-0 will-change-transform">
        <motion.div
          initial={reduce ? false : { scale: 1.14 }}
          animate={{ scale: 1.04 }}
          transition={{ duration: 2.4, ease }}
          className="absolute inset-0"
        >
          <Image
            src={HERO_IMAGE.src}
            alt={HERO_IMAGE.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center grayscale-[70%] contrast-125 brightness-[0.6]"
          />
        </motion.div>
        </div>
        {siteConfig.heroVideo.src && (
          <HlsBackground src={siteConfig.heroVideo.src} poster={siteConfig.heroVideo.poster || undefined} />
        )}
        {/* graphite grade: heavy on the reading side, open on the right */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_13_15/0.96)_0%,rgb(10_13_15/0.82)_38%,rgb(10_13_15/0.35)_75%,rgb(10_13_15/0.55)_100%)]" />
        {/* SAPL-green key light from the upper right, graded into the steel */}
        <div className="absolute inset-0 bg-[radial-gradient(55rem_36rem_at_82%_18%,rgb(4_148_72/0.38),transparent_65%)] mix-blend-screen" />
        <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-bg-inverted via-bg-inverted/70 to-transparent" />
        <div className="blueprint-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_75%_40%,black,transparent_70%)]" />
        {/* moving light reflection across the whole scene */}
        <span className="sheen opacity-50" />
      </div>

      {/* ---- 3D metallic dial ---- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[38vw] top-[14%] -z-10 w-[92vw] max-w-[58rem] sm:-right-[22vw] sm:w-[70vw] lg:-right-[8vw] lg:top-[8%] lg:w-[52vw]"
        style={{ perspective: 1600 }}
      >
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, delay: 0.3, ease }}
          style={reduce ? { rotateY: -16, rotateX: 10 } : { rotateY, rotateX }}
          className="will-change-transform"
        >
          <div data-hero-dial>
            <MetalDial className="h-auto w-full opacity-45 drop-shadow-[0_40px_60px_rgb(0_0_0/0.6)] motion-safe:animate-spin-slow lg:opacity-60" />
          </div>
        </motion.div>
      </div>

      {/* ---- copy ---- */}
      <div className="relative mx-auto flex w-full max-w-[90rem] flex-1 flex-col justify-center px-5 pb-10 pt-[calc(var(--header-h)+2.5rem)] sm:px-8 lg:pb-12">
        <div data-hero-copy className="max-w-4xl">
          <motion.p {...enter(0)} className="tech-label flex items-center gap-3 text-glow">
            <span className="h-px w-10 bg-gradient-to-r from-glow to-transparent" />
            Est. 1983 &middot; Automotive components &middot; OEM supplier
          </motion.p>

          <h1 className="mt-6 text-display-2xl text-white">
            {lines.map((line, li) => (
              <span key={li} className="block">
                {line.words.map((w, wi) => {
                  const idx = wordIndex++;
                  return (
                    <span key={wi}>
                      <Word index={idx} className={line.metal ? "text-metal" : undefined}>
                        {w}
                      </Word>
                      {wi < line.words.length - 1 ? " " : null}
                    </span>
                  );
                })}
              </span>
            ))}
          </h1>

          <motion.p
            {...enter(0.45)}
            className="mt-8 max-w-xl text-base leading-relaxed text-fg-inverted-muted sm:text-lg"
          >
            Shaheen Automotive designs, tools and mass-produces sheet metal, formed pipe and bent rod components for
            automotive and home appliance OEMs, from die design to dimensional sign-off.
          </motion.p>

          <motion.div {...enter(0.55)} className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
            <Button href="/contact" variant="primary" className="w-full sm:w-auto">
              Request a Quote
            </Button>
            <Button href="/manufacturing" variant="onDark" showArrow={false} className="w-full sm:w-auto">
              Explore Manufacturing
            </Button>
          </motion.div>
        </div>
      </div>

      {/* ---- glass stat rail ---- */}
      <motion.div {...enter(0.7)} className="relative mx-auto w-full max-w-[90rem] px-5 pb-6 sm:px-8 sm:pb-8">
        <div className="glass-dark grid grid-cols-2 overflow-hidden rounded-3xl lg:grid-cols-[repeat(4,1fr)_auto]">
          {heroStats.map((stat, i) => (
            <div
              key={stat.label}
              className={
                "px-5 py-5 sm:px-7 sm:py-6 " +
                (i % 2 === 1 ? "border-l border-white/[0.07] " : "") +
                (i >= 2 ? "border-t border-white/[0.07] lg:border-t-0 " : "") +
                (i === 2 ? "lg:border-l " : "")
              }
            >
              <p className="stat-figure-light text-3xl sm:text-4xl">
                <StatCounter value={stat.value} />
              </p>
              <p className="tech-label mt-2.5 text-fg-inverted-muted">{stat.label}</p>
            </div>
          ))}
          <a
            href="#company"
            className="group hidden items-center gap-3 border-l border-white/[0.07] px-7 text-sm text-fg-inverted-muted transition-colors hover:text-white lg:flex"
          >
            Scroll
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-colors group-hover:border-glow/60">
              <ArrowDown size={14} weight="bold" />
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
