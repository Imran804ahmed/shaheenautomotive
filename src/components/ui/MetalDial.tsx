import { useId } from "react";

/**
 * Machined "precision dial": a chrome gear ring (echoing the gear in the
 * SAPL mark), a graduated scale and a signal-green arc. Pure SVG with
 * metallic gradients, so it renders crisp at hero scale with no assets.
 * Rotation / tilt is applied by the caller.
 */
export function MetalDial({ className, teeth = 36 }: { className?: string; teeth?: number }) {
  const uid = useId().replace(/:/g, "");
  const c = 300;
  const pt = (r: number, a: number) => `${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`;

  // gear outline
  const rOuter = 292;
  const rRoot = 270;
  const step = (Math.PI * 2) / teeth;
  const gear: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    gear.push(
      `${i === 0 ? "M" : "L"}${pt(rRoot, a)}`,
      `L${pt(rOuter, a + step * 0.18)}`,
      `L${pt(rOuter, a + step * 0.42)}`,
      `L${pt(rRoot, a + step * 0.6)}`
    );
  }
  const ring = (r: number) => `M${c + r} ${c} a${r} ${r} 0 1 0 ${-2 * r} 0 a${r} ${r} 0 1 0 ${2 * r} 0 Z`;
  const gearPath = `${gear.join(" ")} Z ${ring(246)}`;

  // graduated scale: 120 ticks, every 10th long
  const ticks: string[] = [];
  for (let i = 0; i < 120; i++) {
    const a = (i / 120) * Math.PI * 2;
    const long = i % 10 === 0;
    ticks.push(`M${pt(228, a)} L${pt(long ? 206 : 218, a)}`);
  }

  // green arc: 0° to 118°
  const arcR = 188;
  const arcEnd = (118 * Math.PI) / 180;
  const arc = `M${pt(arcR, 0)} A${arcR} ${arcR} 0 0 1 ${pt(arcR, arcEnd)}`;

  return (
    <svg viewBox="0 0 600 600" className={className} aria-hidden="true" focusable="false">
      <defs>
        {/* brushed chrome: hard light/dark bands read as polished steel */}
        <linearGradient id={`chrome-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f5f7f8" />
          <stop offset="0.22" stopColor="#9aa4ac" />
          <stop offset="0.45" stopColor="#e7ebee" />
          <stop offset="0.5" stopColor="#5d676f" />
          <stop offset="0.68" stopColor="#cfd5da" />
          <stop offset="1" stopColor="#3f484f" />
        </linearGradient>
        <linearGradient id={`bevel-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`green-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7ff0b2" />
          <stop offset="1" stopColor="#049448" />
        </linearGradient>
        <radialGradient id={`face-${uid}`} cx="0.5" cy="0.4" r="0.6">
          <stop offset="0" stopColor="#2a3238" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0a0d0f" stopOpacity="0" />
        </radialGradient>
        <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <circle cx={c} cy={c} r="246" fill={`url(#face-${uid})`} />

      {/* chrome gear, then a 1.5px lit bevel on its upper edge */}
      <path d={gearPath} fill={`url(#chrome-${uid})`} fillRule="evenodd" opacity="0.92" />
      <path d={gearPath} fill="none" stroke={`url(#bevel-${uid})`} strokeWidth="1.5" fillRule="evenodd" />

      {/* graduated scale */}
      <path d={ticks.join(" ")} stroke="#c3cad1" strokeOpacity="0.55" strokeWidth="1.4" />
      <circle cx={c} cy={c} r="232" fill="none" stroke="#c3cad1" strokeOpacity="0.25" />
      <circle cx={c} cy={c} r="160" fill="none" stroke="#c3cad1" strokeOpacity="0.14" strokeDasharray="2 6" />
      <circle cx={c} cy={c} r="112" fill="none" stroke={`url(#chrome-${uid})`} strokeWidth="10" opacity="0.7" />

      {/* signal-green arc with a soft bloom */}
      <path d={arc} fill="none" stroke="#35d07f" strokeWidth="10" strokeLinecap="round" filter={`url(#glow-${uid})`} opacity="0.7" />
      <path d={arc} fill="none" stroke={`url(#green-${uid})`} strokeWidth="4" strokeLinecap="round" />
      <circle cx={pt(arcR, arcEnd).split(" ")[0]} cy={pt(arcR, arcEnd).split(" ")[1]} r="7" fill="#35d07f" />

      {/* crosshair */}
      <path d={`M${c - 60} ${c} H${c + 60} M${c} ${c - 60} V${c + 60}`} stroke="#c3cad1" strokeOpacity="0.3" />
    </svg>
  );
}
