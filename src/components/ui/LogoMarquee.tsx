import Image from "next/image";
import type { Client } from "@/content/company";

/**
 * The one marquee on the site (homepage "customers" strip). Pure CSS
 * animation so it costs nothing on the main thread; pauses entirely under
 * prefers-reduced-motion via the .marquee-track rule in globals via Tailwind
 * arbitrary variant below.
 */
export function LogoMarquee({ clients }: { clients: Client[] }) {
  const loop = [...clients, ...clients];
  return (
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
      <div className="flex w-max animate-[marquee_32s_linear_infinite] items-center gap-10 motion-reduce:animate-none sm:gap-16 lg:gap-20">
        {loop.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className="flex h-14 w-32 shrink-0 items-center justify-center sm:h-20 sm:w-44"
          >
            <Image
              src={client.logo}
              alt={client.name}
              width={176}
              height={80}
              className="max-h-14 w-auto object-contain sm:max-h-20"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
