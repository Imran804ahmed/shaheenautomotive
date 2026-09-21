/**
 * Site-wide motion dial. Tune the whole site from here.
 *
 *  intensity  1-10, default 5. Scales travel distance of reveals/entrances
 *             (0 = fades only, 10 = double distance). Hover/tap feedback is unaffected.
 *  speed      1 = default. 1.5 = 50% faster, 0.75 = slower. Divides durations.
 *
 * Everything still collapses to static under prefers-reduced-motion.
 */
export const motionConfig = {
  intensity: 5,
  speed: 1,
} as const;

export const ease = [0.16, 1, 0.3, 1] as const;

/** Scale a duration (seconds) by the global speed. */
export const dur = (seconds: number) => seconds / motionConfig.speed;

/** Scale a travel distance (px) by the global intensity. */
export const dist = (px: number) => (px * motionConfig.intensity) / 5;
