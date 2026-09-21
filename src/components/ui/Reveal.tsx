"use client";

import { motion, useReducedMotion } from "motion/react";
import { dist, dur, ease, motionConfig } from "@/lib/motion";

/** Direction an element travels from as it enters. Varying it keeps sections from feeling templated. */
export type RevealFrom = "up" | "left" | "right" | "scale";

function offset(from: RevealFrom, y: number) {
  switch (from) {
    case "left":
      return { opacity: 0, x: -dist(36) };
    case "right":
      return { opacity: 0, x: dist(36) };
    case "scale":
      return { opacity: 0, scale: 1 - 0.05 * (dist(20) / 20) };
    default:
      return { opacity: 0, y: dist(y) };
  }
}

export function Reveal({
  children,
  delay = 0,
  y = 20,
  from = "up",
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  from?: RevealFrom;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : offset(from, y)}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: dur(0.6), delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealGroup({
  children,
  className,
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ staggerChildren: stagger / motionConfig.speed }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  y = 20,
}: {
  children: React.ReactNode;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: dist(y) },
        show: { opacity: 1, y: 0, transition: { duration: dur(0.55), ease } },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
