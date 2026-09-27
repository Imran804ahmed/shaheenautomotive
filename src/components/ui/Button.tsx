import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

type ButtonVariant = "primary" | "secondary" | "onDark" | "ghost";

const base =
  "group/btn inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-center text-sm leading-tight sm:whitespace-nowrap font-semibold tracking-tight transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

// light sweep across the button on hover/focus: transform-only, sits under the label
const sheen =
  "relative isolate overflow-hidden before:absolute before:inset-y-0 before:-left-full before:-z-10 before:w-1/2 before:-skew-x-12 before:bg-white/25 before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-[400%] focus-visible:before:translate-x-[400%] motion-reduce:before:hidden";

const variants: Record<ButtonVariant, string> = {
  // signal-green CTA; works on graphite and on light surfaces. The inset
  // highlight gives the fill a lacquered, slightly convex edge.
  primary:
    "bg-accent-ink text-accent-fg border border-white/10 shadow-[inset_0_1px_0_rgb(255_255_255/0.22),0_10px_28px_-10px_rgb(4_148_72/0.75)] hover:bg-accent hover:shadow-[inset_0_1px_0_rgb(255_255_255/0.28),0_18px_36px_-12px_rgb(4_148_72/0.85)]",
  // graphite outline on light surfaces
  secondary:
    "bg-bg-elevated/70 text-fg border border-border shadow-soft hover:border-fg/60 hover:bg-bg-elevated",
  // glass on graphite / photography
  onDark:
    "bg-white/[0.06] text-fg-inverted border border-white/20 backdrop-blur-md shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-white/[0.12] hover:border-white/40",
  ghost:
    "bg-transparent text-fg-inverted underline underline-offset-4 decoration-fg-inverted-muted hover:decoration-fg-inverted",
};

export function Button({
  href,
  children,
  variant = "primary",
  className,
  showArrow = true,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  showArrow?: boolean;
  external?: boolean;
}) {
  const cls = cn(base, variant !== "ghost" && sheen, variants[variant], className);
  const arrow = showArrow && (
    <ArrowUpRight
      size={16}
      weight="bold"
      className="shrink-0 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5 motion-reduce:transform-none"
    />
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
        {arrow}
      </a>
    );
  }
  return (
    <Link href={href} className={cls}>
      {children}
      {arrow}
    </Link>
  );
}
