import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { Gear } from "@/components/ui/Gear";

export function CtaBanner({
  heading = "Have a part that needs a manufacturing partner?",
  body = "Send us your drawing or specification and we'll come back with feasibility, process and a quotation.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="bg-bg py-20 sm:py-24">
      <Container>
        <Reveal from="scale">
          <div className="group surface-ink relative overflow-hidden rounded-[2.25rem] px-7 py-14 shadow-deep sm:px-14 sm:py-16">
            {/* warm glow that fades in when the banner is hovered */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(38rem_18rem_at_85%_100%,rgb(227_166_58/0.16),transparent_70%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            />
            <Gear className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 opacity-80 motion-safe:animate-spin-slow sm:h-[26rem] sm:w-[26rem]" />
            <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
              <div className="max-w-xl">
                <h2 className="text-balance text-display-md font-semibold text-fg-inverted">
                  {heading}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-fg-inverted-muted">{body}</p>
              </div>
              <Button href="/contact" variant="brass" className="shrink-0">
                Request a Quote
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
