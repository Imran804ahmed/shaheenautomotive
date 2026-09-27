import { Container } from "@/components/ui/Container";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import type { Client } from "@/content/company";

export function ClientsStrip({ clients }: { clients: Client[] }) {
  return (
    <section className="border-b border-border bg-bg-elevated py-12 sm:py-14">
      <Container className="flex flex-col items-center gap-8 lg:flex-row lg:gap-12">
        <p className="tech-label shrink-0 text-center text-fg-muted lg:max-w-[14rem] lg:text-left">
          OEM and industry relationships referenced in company materials
        </p>
        <div className="w-full min-w-0 flex-1 grayscale transition-[filter] duration-500 hover:grayscale-0">
          <LogoMarquee clients={clients} />
        </div>
      </Container>
    </section>
  );
}
