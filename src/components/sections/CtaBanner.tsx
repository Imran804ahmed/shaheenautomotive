import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";

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
          <div className="group grain relative isolate overflow-hidden rounded-[2.25rem] bg-bg-inverted px-7 py-14 shadow-deep sm:px-14 sm:py-20">
            <Image
              src="/images/facility/floor/spot-welding-sparks.jpg"
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="-z-10 object-cover grayscale-[40%] brightness-75 transition-transform duration-[1.6s] ease-out group-hover:scale-[1.04]"
            />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(10_13_15/0.97)_0%,rgb(10_13_15/0.85)_50%,rgb(10_13_15/0.4)_100%)]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(40rem_20rem_at_100%_100%,rgb(4_148_72/0.35),transparent_70%)]" />
            <span className="sheen opacity-40" aria-hidden="true" />
            <div className="relative flex flex-col items-start justify-between gap-10 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="tech-label flex items-center gap-3 text-glow">
                  <span className="h-px w-10 bg-gradient-to-r from-glow to-transparent" />
                  Request for quotation
                </p>
                <h2 className="mt-5 text-balance text-display-md text-white">{heading}</h2>
                <p className="mt-5 max-w-xl text-base leading-relaxed text-fg-inverted-muted">{body}</p>
              </div>
              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <Button href="/contact" variant="primary">
                  Request a Quote
                </Button>
                <Button href="/products" variant="onDark" showArrow={false}>
                  Browse products
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
