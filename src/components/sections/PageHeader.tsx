import { BackdropImage } from "@/components/ui/BackdropImage";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Gear } from "@/components/ui/Gear";
import { cn } from "@/lib/cn";

/** `src` is an original under /images; responsive variants are resolved automatically. */
type HeaderImage = { src: string; position?: string };

/**
 * Dark, layered page opener. Slides under the floating header and ends in a rounded edge (or a square one with `flat`).
 * Pass `image` for a photo backdrop lit the same way as the home hero.
 */
export function PageHeader({
  title,
  intro,
  eyebrow,
  image,
  flat,
  children,
}: {
  title: string;
  intro?: string;
  eyebrow?: string;
  image?: HeaderImage;
  /** square bottom edge instead of the default rounded one */
  flat?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "surface-ink relative -mt-[var(--header-h)] overflow-hidden pb-16 pt-[calc(var(--header-h)+3.5rem)] sm:pb-24 sm:pt-[calc(var(--header-h)+5rem)]",
        !flat && "rounded-b-section"
      )}
    >
      {image ? (
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          {/* the page opener is the LCP element on every page that has one */}
          <BackdropImage src={image.src} position={image.position} priority />
          {/* same lighting as the home hero: dark on the copy side, opening up to the right */}
          <div className="scrim-hero" />
          <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg-inverted via-bg-inverted/50 to-transparent" />
        </div>
      ) : (
        <Gear className="pointer-events-none absolute -right-24 top-4 h-72 w-72 opacity-70 motion-safe:animate-spin-slow sm:h-[26rem] sm:w-[26rem]" />
      )}
      <Container className="relative">
        <Reveal>
          {eyebrow && (
            <Eyebrow tone="brass" className="mb-5">
              {eyebrow}
            </Eyebrow>
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
