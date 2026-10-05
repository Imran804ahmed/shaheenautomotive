import { cn } from "@/lib/cn";

type EyebrowTone = "accent" | "brass" | "brassSoft";

const tones: Record<EyebrowTone, { text: string; rule: string }> = {
  accent: { text: "text-accent", rule: "bg-accent" },
  brass: { text: "text-brass", rule: "bg-brass" },
  brassSoft: { text: "text-brass-soft", rule: "bg-brass-soft/70" },
};

/** Small uppercase section label with a leading rule (and a trailing one when `centered`). */
export function Eyebrow({
  children,
  tone = "accent",
  rule,
  centered,
  className,
}: {
  children: React.ReactNode;
  tone?: EyebrowTone;
  /** override the rule colour, e.g. a brass rule next to green text */
  rule?: string;
  centered?: boolean;
  className?: string;
}) {
  const t = tones[tone];
  const line = <span aria-hidden="true" className={cn("h-px w-8 shrink-0", rule ?? t.rule)} />;
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em]",
        t.text,
        className
      )}
    >
      {line}
      {children}
      {centered && line}
    </p>
  );
}
