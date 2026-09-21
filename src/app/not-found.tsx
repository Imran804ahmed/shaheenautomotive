import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="surface-ink -mt-[var(--header-h)] flex min-h-[80vh] items-center rounded-b-[2.5rem] pb-20 pt-[calc(var(--header-h)+5rem)] sm:rounded-b-[3.5rem]">
      <Container className="text-center">
        <p className="mono-figure text-sm text-brass">404</p>
        <h1 className="mt-3 text-4xl font-semibold text-fg-inverted sm:text-5xl">
          Page not found
        </h1>
        <p className="mx-auto mt-3 max-w-md text-base leading-relaxed text-fg-muted">
          The page you&apos;re looking for doesn&apos;t exist or may have moved.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button href="/" variant="brass">Back to home</Button>
          <Button href="/contact" variant="onDark" showArrow={false}>
            Request a quote
          </Button>
        </div>
      </Container>
    </section>
  );
}
