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
    <div className="relative overflow-hidden py-2 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className="flex w-max animate-[marquee_32s_linear_infinite] items-center gap-20 motion-reduce:animate-none">
        {loop.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className="flex h-20 w-44 shrink-0 items-center justify-center"
          >
            <Image
              src={client.logo}
              alt={client.name}
              width={176}
              height={80}
              className="max-h-20 w-auto object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
