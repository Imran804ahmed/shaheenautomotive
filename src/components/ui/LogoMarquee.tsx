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
          // every logo file is the same 480x200 transparent canvas, pre-balanced for visual weight
          <Image
            key={`${client.name}-${i}`}
            src={client.logo}
            // the second copy exists only to make the loop seamless; screen readers get the list once
            alt={i < clients.length ? client.name : ""}
            aria-hidden={i >= clients.length || undefined}
            width={480}
            height={200}
            // rendered 56px / 72px tall, i.e. ~135px / ~173px wide
            sizes="(min-width: 640px) 173px, 135px"
            className="h-14 w-auto shrink-0 sm:h-[4.5rem]"
          />
        ))}
      </div>
    </div>
  );
}
