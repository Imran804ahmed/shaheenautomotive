"use client";

import { motion, useReducedMotion } from "motion/react";
import { PencilRuler, Stack, Pipe, Lightning, Drop, Crosshair, Truck } from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import { ease } from "@/lib/motion";

type Stage = { icon: Icon; title: string; spec: string };

const stages: Stage[] = [
  { icon: PencilRuler, title: "Die & tool design", spec: "UG NX · Creo · AutoForm" },
  { icon: Stack, title: "Stamping", spec: "15–300 T presses" },
  { icon: Pipe, title: "Pipe & rod bending", spec: "NC / CNC · ø10–38 mm" },
  { icon: Lightning, title: "Welding", spec: "CO₂ · spot · induction" },
  { icon: Drop, title: "Surface finishing", spec: "Galvanizing · powder coat" },
  { icon: Crosshair, title: "Inspection", spec: "FARO arm · fixtures" },
  { icon: Truck, title: "Delivery", spec: "To OEM schedule" },
];

/**
 * Blueprint-style flow of material through the plant. The connector draws
 * left-to-right (top-to-bottom on phones) as the diagram enters view, then
 * each station lights up in sequence: it tells the reader this is one
 * continuous line, not seven separate services.
 */
export function ProcessFlow() {
  const reduce = useReducedMotion();
  const inView = { once: true, amount: 0.35 } as const;

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between gap-4">
        <p className="tech-label text-fg-inverted-muted">Fig. 01 &mdash; Material flow, coil to customer</p>
        <p className="tech-label hidden text-glow sm:block">7 stations &middot; 1 roof</p>
      </div>

      <ol className="relative grid grid-cols-1 gap-0 lg:grid-cols-7">
        {/* connector: vertical on mobile, horizontal on desktop */}
        <motion.span
          aria-hidden="true"
          initial={reduce ? false : { scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={inView}
          transition={{ duration: 1.6, ease }}
          className="absolute bottom-8 left-[27px] top-8 w-px origin-top bg-gradient-to-b from-glow via-glow/60 to-glow/20 lg:hidden"
        />
        <motion.span
          aria-hidden="true"
          initial={reduce ? false : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={inView}
          transition={{ duration: 1.8, ease }}
          className="absolute left-[7%] right-[7%] top-[27px] hidden h-px origin-left bg-gradient-to-r from-glow via-glow/60 to-glow/20 lg:block"
        />

        {stages.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <motion.li
              key={stage.title}
              initial={reduce ? false : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.16, ease }}
              className="group relative flex items-start gap-5 py-3 lg:flex-col lg:items-center lg:gap-0 lg:py-0 lg:text-center"
            >
              <span className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-ink-3 text-glow shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_0_0_6px_var(--color-bg-inverted)] transition-[transform,border-color,box-shadow] duration-300 group-hover:-translate-y-1 group-hover:border-glow/60 group-hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.1),0_0_0_6px_var(--color-bg-inverted),0_0_28px_rgb(53_208_127/0.35)]">
                <Icon size={24} weight="duotone" />
              </span>
              <div className="pt-1 lg:mt-5 lg:px-2 lg:pt-0">
                <p className="mono-figure text-[11px] text-fg-inverted-muted">ST-{String(i + 1).padStart(2, "0")}</p>
                <p className="mt-1 font-display text-[0.95rem] font-bold leading-tight tracking-tight text-white">{stage.title}</p>
                <p className="mono-figure mt-1.5 text-[11px] leading-snug text-glow/80">{stage.spec}</p>
              </div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}
