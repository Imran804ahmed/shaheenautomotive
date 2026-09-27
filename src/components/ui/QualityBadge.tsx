import { useId } from "react";

/**
 * Machined roundel for quality credentials: serrated chrome rim, graphite
 * face, SAPL-green inner ring. `title` is the big mark (e.g. "ISO 9001"),
 * `caption` the small ring text.
 */
export function QualityBadge({ title, caption, className }: { title: string; caption: string; className?: string }) {
  const uid = useId().replace(/:/g, "");
  const c = 100;
  const serrations = 60;
  const pts: string[] = [];
  for (let i = 0; i < serrations * 2; i++) {
    const a = (i / (serrations * 2)) * Math.PI * 2;
    const r = i % 2 === 0 ? 98 : 93;
    pts.push(`${i === 0 ? "M" : "L"}${(c + r * Math.cos(a)).toFixed(2)} ${(c + r * Math.sin(a)).toFixed(2)}`);
  }
  const [first, ...rest] = title.split(" ");

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={`${title}: ${caption}`}>
      <defs>
        <linearGradient id={`rim-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.3" stopColor="#aab3ba" />
          <stop offset="0.5" stopColor="#eef1f3" />
          <stop offset="0.52" stopColor="#6f7a84" />
          <stop offset="0.8" stopColor="#d7dde1" />
          <stop offset="1" stopColor="#59636b" />
        </linearGradient>
        <radialGradient id={`face-${uid}`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#2a3238" />
          <stop offset="1" stopColor="#0a0d0f" />
        </radialGradient>
        <path id={`arc-${uid}`} d={`M${c - 66} ${c} a66 66 0 1 1 132 0`} />
      </defs>
      <path d={`${pts.join(" ")} Z`} fill={`url(#rim-${uid})`} />
      <circle cx={c} cy={c} r="86" fill={`url(#face-${uid})`} />
      <circle cx={c} cy={c} r="86" fill="none" stroke="#ffffff" strokeOpacity="0.18" />
      <circle cx={c} cy={c} r="78" fill="none" stroke="#049448" strokeWidth="2.5" />
      <circle cx={c} cy={c} r="54" fill="none" stroke="#c3cad1" strokeOpacity="0.2" strokeDasharray="1.5 4" />
      <text fill="#c3cad1" fontSize="10.5" letterSpacing="2.2" className="font-mono uppercase">
        <textPath href={`#arc-${uid}`} startOffset="50%" textAnchor="middle">
          {caption}
        </textPath>
      </text>
      <text x={c} y={rest.length ? 106 : 112} textAnchor="middle" fill="#ffffff" fontSize="30" fontWeight="800" className="font-display" letterSpacing="-0.5">
        {first}
      </text>
      {rest.length > 0 && (
        <text x={c} y="134" textAnchor="middle" fill="#35d07f" fontSize="19" fontWeight="700" className="font-mono" letterSpacing="1">
          {rest.join(" ")}
        </text>
      )}
      <circle cx={c} cy="158" r="3" fill="#35d07f" />
    </svg>
  );
}
