import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/cn";

export function SectionHeading({
  eyebrow,
  title,
  body,
  className,
  onDark,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Reveal className={cn("max-w-2xl", className)}>
      {eyebrow && (
        <p className={cn("tech-label mb-5 flex items-center gap-3", onDark ? "text-glow" : "text-accent-ink")}>
          <span className={cn("h-px w-10 bg-gradient-to-r to-transparent", onDark ? "from-glow" : "from-accent")} />
          {eyebrow}
        </p>
      )}
      <h2 className={cn("text-balance text-display-md", onDark ? "text-fg-inverted" : "text-fg")}>{title}</h2>
      {body && (
        <p className={cn("mt-5 max-w-xl text-base leading-relaxed sm:text-lg", onDark ? "text-fg-inverted-muted" : "text-fg-muted")}>
          {body}
        </p>
      )}
    </Reveal>
  );
}
