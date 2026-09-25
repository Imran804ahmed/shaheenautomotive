import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GalleryGrid } from "@/components/sections/GalleryGrid";
import type { GalleryPhoto } from "@/content/company";

export function GalleryPreview({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <section className="surface-ink overflow-hidden rounded-[2.5rem] py-20 sm:rounded-[3.5rem] sm:py-28">
      <Container>
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-4 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
            <span className="h-px w-8 bg-brass" />
            Gallery
            <span className="h-px w-8 bg-brass" />
          </p>
          <h2 className="text-balance text-display-md font-semibold text-fg-inverted">
            Precision parts, <span className="text-brass-gradient">up close.</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-fg-inverted-muted sm:text-lg">
            Parts from our press, welding and finishing shops
          </p>
        </Reveal>

        <GalleryGrid photos={photos} tone="dark" />

        <Reveal className="mt-12 flex justify-center">
          <Button href="/gallery" variant="brass">
            View Full Gallery
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
