import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { Button } from "@/components/ui/Button";
import { BlueprintPart } from "@/components/ui/BlueprintPart";
import { ProcessFlow } from "@/components/sections/ProcessFlow";
import { pressShopTotal, weldingShopTotal } from "@/content/company";
import { cn } from "@/lib/cn";

type Cell = {
  code: string;
  title: string;
  image: string;
  alt: string;
  specs: [string, string][];
  className: string;
  aspect: string;
};

const cells: Cell[] = [
  {
    code: "PS",
    title: "Press shop",
    image: "/images/facility/floor/press-line.jpg",
    alt: "Operators running a line of mechanical power presses in the SAPL press shop",
    specs: [
      ["Presses", `${pressShopTotal.machines}`],
      ["Tonnage", "15–300 T"],
      ["Drive", "Mech · hydr · pneu"],
    ],
    className: "lg:col-span-7",
    aspect: "aspect-[4/3] lg:aspect-[16/11]",
  },
  {
    code: "PB",
    title: "Pipe bending",
    image: "/images/facility/floor/pipe-bending-cell.jpg",
    alt: "One operator unloading a bent tube while another pulls stock from a stack of steel tubes",
    specs: [
      ["Control", "NC / CNC"],
      ["Diameter", "ø10–38 mm"],
      ["Wall", "to 2.5 mm"],
    ],
    className: "lg:col-span-5",
    aspect: "aspect-[4/3] lg:aspect-auto lg:h-full",
  },
  {
    code: "WS",
    title: "Welding & assembly",
    image: "/images/facility/floor/mig-welding-fixture.jpg",
    alt: "Welder in a cap and safety glasses welding a pipe assembly on a fixture",
    specs: [
      ["Machines", `${weldingShopTotal.machines}`],
      ["Process", "CO₂ · spot"],
      ["Fixtured", "Per part"],
    ],
    className: "lg:col-span-5",
    aspect: "aspect-[4/3] lg:aspect-auto lg:h-full",
  },
  {
    code: "QC",
    title: "Metrology & fixtures",
    image: "/images/facility/floor/checking-fixture.jpg",
    alt: "Inspector clamping a stamped sheet metal panel into a checking fixture",
    specs: [
      ["Scanning", "FARO arm"],
      ["Gauging", "Checking fixtures"],
      ["Sign-off", "SAPL + OEM"],
    ],
    className: "lg:col-span-7",
    aspect: "aspect-[4/3] lg:aspect-[16/11]",
  },
];

/** Home-page factory showcase: graphite + blueprint, machine photography on 3D cards. */
export function ManufacturingShowcase() {
  return (
    <section className="surface-ink grain relative overflow-clip py-24 sm:py-32">
      <div aria-hidden="true" className="blueprint-grid pointer-events-none absolute inset-0 [mask-image:linear-gradient(180deg,black,transparent_55%)]" />

      <Container className="relative">
        {/* intro + technical drawing */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <Reveal className="lg:col-span-6">
            <p className="tech-label flex items-center gap-3 text-glow">
              <span className="h-px w-10 bg-gradient-to-r from-glow to-transparent" />
              Manufacturing
            </p>
            <h2 className="mt-5 text-balance text-display-md text-white">
              One plant. Every process. <span className="text-metal">From die to dispatch.</span>
            </h2>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-fg-inverted-muted sm:text-lg">
              Tooling is designed and cut in-house, parts are pressed, bent, welded and finished on our own lines,
              and every batch is measured before it leaves. One accountable team, one quality system.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button href="/manufacturing" variant="primary">
                Manufacturing capabilities
              </Button>
              <Button href="/facility" variant="onDark" showArrow={false}>
                Inside the plant
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} from="scale" className="lg:col-span-6">
            <div className="relative rounded-[2rem] border border-white/[0.08] bg-bg-inverted/60 p-4 shadow-deep sm:p-6">
              <div className="blueprint-grid absolute inset-0 rounded-[2rem] opacity-70" aria-hidden="true" />
              <div className="relative flex items-center justify-between">
                <span className="tech-label text-fg-inverted-muted">DWG 04-117</span>
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-glow shadow-[0_0_8px_rgb(53_208_127/0.9)]" />
                  <span className="tech-label text-glow">Tooling design</span>
                </span>
              </div>
              <BlueprintPart className="relative mt-3 h-auto w-full" />
            </div>
          </Reveal>
        </div>

        {/* machine cells */}
        <div className="mt-20 grid grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
          {cells.map((cell, i) => (
            <Reveal key={cell.code} delay={(i % 2) * 0.08} className={cn("h-full", cell.className)}>
              <Tilt className="h-full" max={5}>
                <Link
                  href="/facility"
                  className="group relative block h-full overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-ink-3 shadow-deep"
                >
                  <div className={cn("relative w-full", cell.aspect)}>
                    <Image
                      src={cell.image}
                      alt={cell.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover grayscale-[45%] transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-inverted via-bg-inverted/40 to-bg-inverted/5" />
                    <div className="absolute inset-0 bg-[radial-gradient(30rem_18rem_at_0%_100%,rgb(4_148_72/0.35),transparent_65%)] opacity-50 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="sheen sheen-hover" aria-hidden="true" />

                    {/* corner registration marks: blueprint framing */}
                    <span aria-hidden="true" className="absolute left-4 top-4 h-4 w-4 border-l border-t border-white/40" />
                    <span aria-hidden="true" className="absolute right-4 top-4 h-4 w-4 border-r border-t border-white/40" />

                    <div className="absolute left-9 top-4 flex items-center gap-2">
                      <span className="mono-figure rounded-md bg-accent-ink px-1.5 py-0.5 text-[10px] font-semibold text-white">{cell.code}</span>
                      <span className="tech-label text-white/70">Cell {String(i + 1).padStart(2, "0")}</span>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <div className="flex items-end justify-between gap-4">
                        <h3 className="font-display text-2xl font-bold leading-none tracking-tight text-white sm:text-[1.75rem]">
                          {cell.title}
                        </h3>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white backdrop-blur transition-[transform,background-color,border-color] duration-300 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent-ink">
                          <ArrowUpRight size={16} weight="bold" />
                        </span>
                      </div>
                      <dl className="glass-dark mt-4 grid grid-cols-3 divide-x divide-white/[0.07] rounded-2xl">
                        {cell.specs.map(([k, v]) => (
                          <div key={k} className="min-w-0 px-3 py-2.5 sm:px-4 sm:py-3">
                            <dt className="tech-label truncate text-[10px] text-fg-inverted-muted">{k}</dt>
                            <dd className="mono-figure mt-1 text-[11px] font-medium leading-tight text-white sm:text-sm">{v}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                  <span className="spot-glow" aria-hidden="true" />
                  <span className="spot-border" aria-hidden="true" />
                </Link>
              </Tilt>
            </Reveal>
          ))}
        </div>

        {/* process diagram */}
        <Reveal className="mt-20 sm:mt-24">
          <div className="rounded-[2rem] border border-white/[0.08] bg-white/[0.02] p-6 sm:p-10">
            <ProcessFlow />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
