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
        <p
          className={cn(
            "mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em]",
            onDark ? "text-brass" : "text-accent"
          )}
        >
          <span className={cn("h-px w-8", onDark ? "bg-brass" : "bg-accent")} />
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "text-balance text-display-md font-semibold",
          onDark ? "text-fg-inverted" : "text-fg"
        )}
      >
        {title}
      </h2>
      {body && (
        <p className={cn("mt-4 text-base leading-relaxed sm:text-lg", onDark ? "text-fg-inverted-muted" : "text-fg-muted")}>
          {body}
        </p>
      )}
    </Reveal>
  );
}
