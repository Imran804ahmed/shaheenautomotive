"use client";

import Image from "next/image";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { Gear } from "@/components/ui/Gear";
import { facilityPhotos } from "@/content/company";

/**
 * Layered CSS-3D scene for the hero: press-shop photo on stacked "sheet"
 * plates, a slow gear behind, and floating fact chips at different depths.
 * Pointer movement tilts the whole scene, so the depth reads as real.
 * No WebGL / extra JS libraries: one photo, one SVG, transforms only.
 */
export function HeroScene() {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-20, -2]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [12, 0]);

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== "mouse") return;
        const r = e.currentTarget.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
      className="relative mx-auto w-full max-w-[26rem] sm:max-w-md lg:max-w-none"
      style={{ perspective: 1400 }}
    >
      {/* gear sits behind the scene: the one slow perpetual motion on the page */}
      <Gear className="pointer-events-none absolute -right-16 -top-14 h-72 w-72 motion-safe:animate-spin-slow sm:h-96 sm:w-96 lg:-right-24 lg:-top-20" />

      <motion.div
        style={
          reduce
            ? { rotateY: -10, rotateX: 5, transformStyle: "preserve-3d" }
            : { rotateX, rotateY, transformStyle: "preserve-3d" }
        }
        className="relative aspect-[4/5] w-full will-change-transform"
      >
        {/* stacked plates: depth without weight */}
        <div
          className="absolute inset-0 rounded-[2rem] border border-white/10 bg-gradient-to-br from-ink-3 to-bg-inverted"
          style={{ transform: "translate3d(38px, 30px, -90px)" }}
        />
        <div
          className="absolute inset-0 rounded-[2rem] border border-white/15 bg-gradient-to-br from-accent/60 to-ink-2"
          style={{ transform: "translate3d(19px, 15px, -45px)" }}
        />

        <div className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/20 bg-bg-inverted shadow-deep">
          <Image
            src={facilityPhotos[0].src}
            alt={facilityPhotos[0].alt}
            fill
            priority
            sizes="(min-width: 1024px) 42vw, 90vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-inverted/80 via-transparent to-transparent" />
          <p className="absolute bottom-5 right-6 text-xs font-medium text-fg-inverted/85">
            Press shop floor, Shaheen Automotive
          </p>
        </div>

        <div
          className="absolute left-2 top-10 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-deep backdrop-blur-md sm:-left-10"
          style={{ transform: "translateZ(80px)" }}
        >
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-brass">Since</p>
          <p className="mono-figure text-2xl font-semibold text-fg-inverted">1983</p>
        </div>

        <div
          className="absolute -bottom-6 left-2 rounded-2xl border border-white/20 bg-bg-elevated px-5 py-4 shadow-deep sm:-left-12"
          style={{ transform: "translateZ(110px)" }}
        >
          <p className="mono-figure text-2xl font-semibold text-fg">100&ndash;120</p>
          <p className="mt-0.5 text-xs text-fg-muted">Tons manufactured per month</p>
        </div>

        <div
          className="absolute right-2 bottom-16 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-deep backdrop-blur-md sm:-right-8"
          style={{ transform: "translateZ(60px)" }}
        >
          <p className="mono-figure text-2xl font-semibold text-fg-inverted">350+</p>
          <p className="text-xs text-fg-inverted-muted">Parts in production</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
