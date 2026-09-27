"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Engineering drawing of a stamped mounting bracket: outline, pierced holes,
 * centre lines and dimension callouts in the blueprint style. The linework
 * draws itself on once when scrolled into view, the way a plotter would.
 * Illustrative only: not a drawing of a specific customer part.
 */
export function BlueprintPart({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const draw = (delay: number, duration = 1.4) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: 0.4 },
          transition: { pathLength: { duration, delay, ease: [0.65, 0, 0.35, 1] as const }, opacity: { duration: 0.2, delay } },
        };
  const fade = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.6, delay },
        };

  const line = "stroke-glow";
  const dim = "stroke-silver/60";

  return (
    <svg
      viewBox="0 0 520 360"
      className={className}
      role="img"
      aria-label="Illustrative engineering drawing of a stamped sheet metal bracket with dimensions"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* part outline */}
      <motion.path
        {...draw(0)}
        className={line}
        strokeWidth="2"
        d="M90 90 H330 Q350 90 358 108 L392 186 Q400 204 420 204 H440 V270 H90 Z"
      />
      {/* flange bend line */}
      <motion.path {...draw(0.5, 0.8)} className={line} strokeWidth="1" strokeDasharray="6 5" d="M330 90 L330 270 M392 186 L392 270" />
      {/* embossed rib */}
      <motion.path {...draw(0.7, 1)} className={line} strokeWidth="1.4" d="M130 160 H290 Q300 160 300 170 V190 Q300 200 290 200 H130 Q120 200 120 190 V170 Q120 160 130 160 Z" />
      {/* pierced holes */}
      {[
        [130, 122],
        [290, 122],
        [130, 238],
        [290, 238],
      ].map(([cx, cy], i) => (
        <motion.circle key={i} {...draw(0.9 + i * 0.08, 0.6)} className={line} strokeWidth="1.6" cx={cx} cy={cy} r="11" />
      ))}
      <motion.circle {...draw(1.2, 0.6)} className={line} strokeWidth="1.6" cx="416" cy="238" r="14" />

      {/* centre lines */}
      <motion.path
        {...fade(1.3)}
        className={dim}
        strokeWidth="0.8"
        strokeDasharray="14 4 2 4"
        d="M110 122 H150 M130 102 V142 M270 122 H310 M290 102 V142 M110 238 H150 M130 218 V258 M270 238 H310 M290 218 V258 M396 238 H436 M416 218 V258"
      />

      {/* dimension: overall length */}
      <motion.g {...fade(1.5)} className={dim} strokeWidth="0.9">
        <path d="M90 282 V318 M440 282 V318 M90 308 H440" />
        <path d="M90 308 l9 -4 v8 Z M440 308 l-9 -4 v8 Z" className="fill-silver/60" />
      </motion.g>
      {/* dimension: height */}
      <motion.g {...fade(1.6)} className={dim} strokeWidth="0.9">
        <path d="M78 90 H44 M78 270 H44 M54 90 V270" />
        <path d="M54 90 l-4 9 h8 Z M54 270 l-4 -9 h8 Z" className="fill-silver/60" />
      </motion.g>
      {/* dimension: hole pitch */}
      <motion.g {...fade(1.7)} className={dim} strokeWidth="0.9">
        <path d="M130 70 V100 M290 70 V100 M130 78 H290" />
        <path d="M130 78 l9 -4 v8 Z M290 78 l-9 -4 v8 Z" className="fill-silver/60" />
      </motion.g>
      {/* leader to hole */}
      <motion.path {...fade(1.8)} className={dim} strokeWidth="0.9" d="M424 226 L456 186 H492" />

      <motion.g {...fade(1.9)} className="fill-silver font-mono" fontSize="11" letterSpacing="0.06em">
        <text x="232" y="330" textAnchor="middle">350.0 ±0.2</text>
        <text x="24" y="184" textAnchor="middle" transform="rotate(-90 24 184)">180.0 ±0.2</text>
        <text x="210" y="66" textAnchor="middle">160.0</text>
        <text x="460" y="180">ø28</text>
        <text x="370" y="118" className="fill-glow">R20</text>
      </motion.g>

      {/* title block */}
      <motion.g {...fade(2.1)}>
        <rect x="360" y="10" width="150" height="54" rx="3" className="stroke-silver/40" strokeWidth="0.9" />
        <path d="M360 28 H510 M440 28 V64" className="stroke-silver/40" strokeWidth="0.9" />
        <text x="368" y="23" className="fill-silver font-mono" fontSize="8.5" letterSpacing="0.12em">SAPL · BRACKET, MTG</text>
        <text x="368" y="44" className="fill-silver/70 font-mono" fontSize="8">MAT  SPCC</text>
        <text x="368" y="57" className="fill-silver/70 font-mono" fontSize="8">t = 1.6</text>
        <text x="448" y="44" className="fill-silver/70 font-mono" fontSize="8">SCALE 1:2</text>
        <text x="448" y="57" className="fill-glow font-mono" fontSize="8">REV C</text>
      </motion.g>
    </svg>
  );
}
