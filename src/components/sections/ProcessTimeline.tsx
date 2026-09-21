"use client";

import { useRef, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap } from "@/lib/gsap";
import type { ProcessStep } from "@/content/company";

export function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const root = useRef<HTMLElement>(null);

  // Scroll-scrubbed: each stage's progress bar fills as it travels up the viewport
  // (shows sequence and progress), while the ghost numerals drift for depth.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((card) => {
        const trigger = { trigger: card, start: "top 85%", end: "top 40%", scrub: true };
        gsap.fromTo(card.querySelector("[data-step-bar]"), { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: trigger });
        gsap.fromTo(
          card.querySelector("[data-step-ghost]"),
          { y: 24 },
          { y: -24, ease: "none", scrollTrigger: { ...trigger, start: "top bottom", end: "bottom top" } }
        );
      });
    }, root);
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={root}
      className="rounded-[2.5rem] bg-bg-elevated py-20 shadow-soft sm:rounded-[3.5rem] sm:py-28"
    >
      <Container>
        <SectionHeading eyebrow="Process" title="From feasibility to mass production, in six stages." />

        <RevealGroup className="mt-14 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step) => (
            <RevealItem
              key={step.step}
              className="group relative overflow-hidden rounded-[1.5rem] border border-border bg-bg transition-colors duration-300 hover:border-accent/40"
            >
              <div data-step className="relative p-7">
                <div className="absolute inset-x-0 top-0 h-1 bg-accent/10">
                  <div data-step-bar className="h-full origin-left bg-accent" />
                </div>
                <span
                  data-step-ghost
                  aria-hidden="true"
                  className="mono-figure pointer-events-none absolute -right-2 -top-4 select-none text-[6.5rem] font-semibold leading-none text-accent/[0.07] will-change-transform"
                >
                  {String(step.step).padStart(2, "0")}
                </span>
                <span className="mono-figure inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-accent px-2 text-sm font-semibold text-accent-fg">
                  {String(step.step).padStart(2, "0")}
                </span>
                <h3 className="relative mt-5 text-lg font-semibold text-fg">{step.title}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-fg-muted">{step.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </section>
  );
}
