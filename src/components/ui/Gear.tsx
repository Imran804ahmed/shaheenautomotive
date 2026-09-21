import { useId } from "react";

/**
 * Decorative gear silhouette echoing the SAPL mark. Pure SVG (no assets),
 * generated from tooth count so it stays crisp at any size.
 */
export function Gear({
  teeth = 18,
  className,
}: {
  teeth?: number;
  className?: string;
}) {
  const id = useId();
  const cx = 100;
  const rOuter = 96;
  const rRoot = 80;
  const step = (Math.PI * 2) / teeth;
  const pts: string[] = [];
  const pt = (r: number, a: number) =>
    `${(cx + r * Math.cos(a)).toFixed(2)} ${(cx + r * Math.sin(a)).toFixed(2)}`;
  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    pts.push(
      `${i === 0 ? "M" : "L"}${pt(rRoot, a)}`,
      `L${pt(rOuter, a + step * 0.16)}`,
      `L${pt(rOuter, a + step * 0.44)}`,
      `L${pt(rRoot, a + step * 0.6)}`
    );
  }
  const d = `${pts.join(" ")} Z M${cx + 34} ${cx} a34 34 0 1 0 -68 0 a34 34 0 1 0 68 0 Z M${cx + 62} ${cx} a62 62 0 1 0 -124 0 a62 62 0 1 0 124 0 Z`;

  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38c27a" stopOpacity="0.55" />
          <stop offset="1" stopColor="#17703f" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <path d={d} fill={`url(#${id})`} fillRule="evenodd" />
    </svg>
  );
}
