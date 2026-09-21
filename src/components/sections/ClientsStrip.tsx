import { Container } from "@/components/ui/Container";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import type { Client } from "@/content/company";

export function ClientsStrip({ clients }: { clients: Client[] }) {
  return (
    <section className="bg-bg py-14 sm:py-16">
      <Container>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-fg-muted">
          OEM and industry relationships referenced in company materials
        </p>
        <div className="mt-8">
          <LogoMarquee clients={clients} />
        </div>
      </Container>
    </section>
  );
}
