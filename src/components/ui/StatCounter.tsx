"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

/**
 * Animates the numeric portion of a stat value (e.g. "350+", "100-120")
 * upward on scroll-into-view. Communicates: these are headline credibility
 * numbers worth a beat of attention. Writes directly to the DOM node rather
 * than React state, so it does not re-render the tree every frame.
 */
export function StatCounter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (reduce) {
      el.textContent = value;
      return;
    }
    if (!inView) return;

    const match = value.match(/\d[\d,]*/);
    if (!match || match.index === undefined) {
      el.textContent = value;
      return;
    }

    const target = parseInt(match[0].replace(/,/g, ""), 10);
    const prefix = value.slice(0, match.index);
    const suffix = value.slice(match.index + match[0].length);

    const controls = animate(0, target, {
      duration: 1.3,
      ease: [0.16, 1, 0.3, 1],
      onUpdate(latest) {
        el.textContent = `${prefix}${Math.round(latest).toLocaleString()}${suffix}`;
      },
    });

    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <span ref={ref} className={className}>
      {reduce ? value : "0"}
    </span>
  );
}
