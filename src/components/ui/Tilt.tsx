"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

/**
 * Pointer-driven 3D tilt. Communicates: this card is interactive and physical.
 * Also writes --spot-x/--spot-y as the pointer moves, so a `.spot-glow`
 * element placed inside the caller's own rounded/overflow-hidden markup can
 * track a light-following glow (see globals.css `.spot-track`/`.spot-glow`).
 * Uses motion values (no React state) and only activates for a fine pointer
 * with motion allowed; touch and reduced-motion users get a plain card.
 */
export function Tilt({
  children,
  className,
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 200, damping: 20, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 200, damping: 20, mass: 0.4 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div className={className} style={{ perspective: 1000 }}>
      <motion.div
        ref={ref}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse" || !ref.current) return;
          const r = ref.current.getBoundingClientRect();
          const nx = (e.clientX - r.left) / r.width - 0.5;
          const ny = (e.clientY - r.top) / r.height - 0.5;
          px.set(nx);
          py.set(ny);
          ref.current.style.setProperty("--spot-x", `${(nx + 0.5) * 100}%`);
          ref.current.style.setProperty("--spot-y", `${(ny + 0.5) * 100}%`);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
        className="spot-track h-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
