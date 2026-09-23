"use client";

import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/cn";

/**
 * Tracks the pointer and writes it as --spot-x/--spot-y CSS custom
 * properties, for a `.spot-glow` element the caller places inside its own
 * rounded + overflow-hidden card markup (see globals.css). Writes straight
 * to the DOM style, not React state, so pointer movement never re-renders.
 * Mouse only; touch and reduced-motion users get the plain card underneath.
 */
export function SpotTrack({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div
      ref={ref}
      className={cn("spot-track", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        ref.current.style.setProperty("--spot-x", `${((e.clientX - r.left) / r.width) * 100}%`);
        ref.current.style.setProperty("--spot-y", `${((e.clientY - r.top) / r.height) * 100}%`);
      }}
    >
      {children}
    </div>
  );
}
