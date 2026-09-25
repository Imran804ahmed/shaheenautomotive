import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Gear } from "@/components/ui/Gear";

/** Dark, layered page opener. Slides under the floating header and ends in a rounded edge. */
export function PageHeader({
  title,
  intro,
  eyebrow,
  children,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="surface-ink relative -mt-[var(--header-h)] overflow-hidden rounded-b-[2.5rem] pb-16 pt-[calc(var(--header-h)+3.5rem)] sm:rounded-b-[3.5rem] sm:pb-24 sm:pt-[calc(var(--header-h)+5rem)]">
      <Gear className="pointer-events-none absolute -right-24 top-4 h-72 w-72 opacity-70 motion-safe:animate-spin-slow sm:h-[26rem] sm:w-[26rem]" />
      <Container className="relative">
        <Reveal>
          {eyebrow && (
            <p className="mb-5 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
              <span className="h-px w-8 bg-brass" />
              {eyebrow}
            </p>
          )}
          <h1 className="max-w-3xl text-balance text-display-lg font-semibold text-fg-inverted">
            {title}
          </h1>
        </Reveal>
        {intro && (
          <Reveal delay={0.08}>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-inverted-muted sm:text-lg">{intro}</p>
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
