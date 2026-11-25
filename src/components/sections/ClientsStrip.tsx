import { getPageImages } from "@/lib/server/website-images";
import { globalClientKey } from "@/lib/server/website-image-inventory";
import { clientImageKey, type HomeImages } from "@/lib/server/homepage-images";
import { Container } from "@/components/ui/Container";
import { LogoMarquee } from "@/components/ui/LogoMarquee";
import type { Client } from "@/content/company";

export async function ClientsStrip({ clients, images }: { clients: Client[]; images?: HomeImages }) {
  const global = await getPageImages("global");
  return (
    <section className="bg-bg py-14 sm:py-16">
      <Container>
        <p className="text-balance text-center text-sm font-bold uppercase tracking-[0.16em] text-fg sm:text-base lg:text-lg">
          Trusted by Industry Leaders in Automotive &amp; Manufacturing
        </p>
        <div className="mt-10 sm:mt-12 lg:mt-14">
          <LogoMarquee clients={clients.map((client) => {
            const image = images?.[clientImageKey(client.name)] ?? global[globalClientKey(client.name)];
            return { ...client, logo: image?.src || client.logo, alt: image?.alt };
          })} />
        </div>
      </Container>
    </section>
  );
}
