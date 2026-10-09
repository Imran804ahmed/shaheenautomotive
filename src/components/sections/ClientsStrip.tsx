import { Container } from "@/components/ui/Container";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import type { Client } from "@/content/company";

export function ClientsStrip({ clients }: { clients: Client[] }) {
  return (
    <section className="bg-bg py-14 sm:py-16">
      <Container>
        <p className="text-balance text-center text-sm font-bold uppercase tracking-[0.16em] text-fg sm:text-base lg:text-lg">
          Trusted by Industry Leaders in Automotive &amp; Manufacturing
        </p>
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <LogoMarquee clients={clients} />
        </div>
      </Container>
    </section>
  );
}
