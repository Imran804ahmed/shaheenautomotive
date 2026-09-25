"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Calculator,
  PencilRuler,
  Wrench,
  Flask,
  SealCheck,
  Factory,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon } from "@phosphor-icons/react";
import { Container } from "@/components/ui/Container";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { cn } from "@/lib/cn";
import { ease } from "@/lib/motion";
import type { ProcessStep } from "@/content/company";

const stepIcons: Record<number, Icon> = {
  1: Calculator,
  2: PencilRuler,
  3: Wrench,
  4: Flask,
  5: SealCheck,
  6: Factory,
};

const pad = (n: number) => String(n).padStart(2, "0");

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    // Highlight the stage crossing the middle of the viewport, so the sticky
    // counter and the rail always tell the reader where they are in the sequence.
    const triggers = gsap.utils.toArray<HTMLElement>("[data-step]", root.current).map((el, i) =>
      ScrollTrigger.create({
        trigger: el,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => self.isActive && setActive(i),
      })
    );

    // Rail fills as the reader moves through the stages (scrubbed to scroll).
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        "[data-rail-fill]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: "[data-rail]", start: "top 55%", end: "bottom 55%", scrub: true },
        }
      );
    }, root);

    return () => {
      triggers.forEach((t) => t.kill());
      mm.revert();
    };
  }, []);

  const current = steps[active];

  return (
    <section
      ref={root}
      className="relative overflow-clip rounded-[2.5rem] bg-bg-elevated py-20 shadow-soft sm:rounded-[3.5rem] sm:py-28"
    >
      {/* faint engineering grid, fading out toward the bottom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_65%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent/10 blur-3xl"
      />

      <Container className="relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* left: sticky heading + live stage counter */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <SectionHeading
                eyebrow="Process"
                title="From feasibility to mass production, in six stages."
                body="One accountable team carries every part from first quotation to on-time delivery, with the customer signing off at each gate."
              />

              <Reveal delay={0.1} className="mt-10 hidden lg:block">
                <div className="rounded-[1.75rem] border border-border bg-bg p-7">
                  <div className="flex items-baseline gap-3">
                    <span className="stat-figure text-7xl">
                      <motion.span
                        key={active}
                        className="inline-block"
                        initial={reduce ? false : { opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.45, ease }}
                      >
                        {pad(current.step)}
                      </motion.span>
                    </span>
                    <span className="mono-figure text-lg text-fg-muted">/ {pad(steps.length)}</span>
                  </div>
                  <p className="stat-label mt-4">Current stage</p>
                  <motion.p
                    key={`t-${active}`}
                    className="mt-1 text-xl font-semibold text-fg"
                    initial={reduce ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                  >
                    {current.title}
                  </motion.p>

                  <div className="mt-6 flex gap-1.5" aria-hidden="true">
                    {steps.map((s, i) => (
                      <span
                        key={s.step}
                        className={cn(
                          "h-1.5 flex-1 rounded-full transition-colors duration-500",
                          i <= active ? "bg-accent" : "bg-border"
                        )}
                      />
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* right: timeline */}
          <div className="lg:col-span-7">
            <div data-rail className="relative">
              {/* rail track + scrubbed fill, centered on the 3rem nodes */}
              <div aria-hidden="true" className="absolute bottom-6 left-6 top-6 w-px -translate-x-1/2 bg-border">
                <div data-rail-fill className="h-full w-full origin-top bg-gradient-to-b from-accent to-glow" />
              </div>

              <RevealGroup className="relative space-y-5">
                {steps.map((step, i) => {
                  const StepIcon = stepIcons[step.step] ?? SealCheck;
                  const isActive = i === active;
                  const isDone = i < active;
                  return (
                    <RevealItem key={step.step}>
                      <div data-step className="group relative flex gap-4 sm:gap-7">
                        <div
                          className={cn(
                            "relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-all duration-500",
                            isActive
                              ? "scale-110 border-accent bg-accent text-accent-fg shadow-[0_0_0_6px_var(--color-accent-soft)]"
                              : isDone
                                ? "border-accent bg-accent-soft text-accent"
                                : "border-border bg-bg-elevated text-fg-muted"
                          )}
                        >
                          <StepIcon size={22} weight={isActive ? "fill" : "regular"} />
                        </div>

                        <div
                          className={cn(
                            "relative min-w-0 flex-1 overflow-hidden rounded-[1.5rem] border p-5 transition-all duration-500 sm:p-7",
                            isActive
                              ? "border-accent/40 bg-bg shadow-lift"
                              : "border-border bg-bg/60 group-hover:-translate-y-0.5 group-hover:border-accent/30 group-hover:shadow-soft"
                          )}
                        >
                          <span
                            aria-hidden="true"
                            className={cn(
                              "mono-figure pointer-events-none absolute -right-1 -top-4 select-none text-[4.5rem] font-semibold leading-none transition-colors duration-500 sm:-top-5 sm:text-[6rem]",
                              isActive ? "text-accent/[0.12]" : "text-accent/[0.05]"
                            )}
                          >
                            {pad(step.step)}
                          </span>
                          <p className="mono-figure relative text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                            Stage {pad(step.step)}
                          </p>
                          <h3 className="relative mt-2 text-xl font-semibold text-fg sm:text-2xl">{step.title}</h3>
                          <p className="relative mt-3 max-w-lg text-sm leading-relaxed text-fg-muted sm:text-[0.95rem]">
                            {step.body}
                          </p>
                        </div>
                      </div>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
