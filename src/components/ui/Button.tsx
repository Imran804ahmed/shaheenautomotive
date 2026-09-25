import Link from "next/link";
import { cn } from "@/lib/cn";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

type ButtonVariant = "primary" | "brass" | "secondary" | "onDark" | "ghost";

const base =
  "group/btn inline-flex min-h-12 max-w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-center text-sm leading-tight sm:whitespace-nowrap font-semibold tracking-tight transition-[transform,box-shadow,background-color,border-color] duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

// light sweep across the button on hover/focus: transform-only, sits under the label
const sheen =
  "relative isolate overflow-hidden before:absolute before:inset-y-0 before:-left-full before:-z-10 before:w-1/2 before:-skew-x-12 before:bg-white/25 before:transition-transform before:duration-700 before:ease-out hover:before:translate-x-[400%] focus-visible:before:translate-x-[400%] motion-reduce:before:hidden";

const variants: Record<ButtonVariant, string> = {
  // main CTA on light surfaces
  primary:
    "bg-accent text-accent-fg border border-accent shadow-[0_10px_24px_-10px_rgb(23_112_63/0.7)] hover:bg-accent-strong hover:border-accent-strong hover:shadow-[0_16px_30px_-10px_rgb(23_112_63/0.75)]",
  // main CTA on ink surfaces
  brass:
    "bg-brass text-brass-fg border border-brass shadow-[0_10px_30px_-10px_rgb(227_166_58/0.6)] hover:bg-brass-strong hover:border-brass-strong hover:shadow-[0_16px_36px_-10px_rgb(227_166_58/0.7)]",
  secondary:
    "bg-bg-elevated/60 text-fg border border-border hover:border-fg hover:bg-bg-elevated",
  onDark:
    "bg-white/5 text-fg-inverted border border-white/20 backdrop-blur hover:bg-white/10 hover:border-white/40",
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
