import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/content/site";
import { brand } from "@/content/company";
import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Inside the Plant", href: "/facility" },
  { label: "Quality", href: "/quality" },
  { label: "Contact", href: "/contact" },
];

const productLinks = [
  ...siteConfig.productCategories.map((c) => ({ label: c.label, href: `/products/${c.slug}` })),
  { label: "Gallery", href: "/gallery" },
];

const headingClasses = "text-xs font-semibold uppercase tracking-[0.18em] text-white/60";

/** A footer link with a short green dash that draws in on hover. */
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 py-1 text-sm text-fg-inverted-muted transition-colors duration-200 hover:text-white pointer-coarse:min-h-11"
    >
      <span className="h-px w-0 bg-glow transition-[width] duration-300 group-hover:w-3 motion-reduce:transition-none" />
      {children}
    </Link>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-footer">
      {/* oversized brand mark, barely visible, anchored bottom right */}
      <Image
        src={brand.markLight}
        alt=""
        aria-hidden="true"
        width={512}
        height={509}
        // this textured mark compresses better as the original 21KB PNG than as any WebP rendition
        unoptimized
        className="pointer-events-none absolute -bottom-40 -right-32 w-[34rem] opacity-[0.035] sm:w-[44rem]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <Container className="relative">
        <div className="flex flex-col gap-8 border-b border-white/[0.07] pb-12 pt-16 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-3xl text-balance text-[clamp(1.9rem,1.2rem+2.6vw,3.4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Engineering excellence. <span className="text-metal">Driving the future.</span>
          </p>
          <Link
            href="/contact"
            className="group inline-flex min-h-12 shrink-0 items-center gap-3 self-start rounded-full border border-white/15 bg-white/[0.04] py-2 pl-6 pr-2 text-sm font-semibold text-white transition-colors hover:border-accent hover:bg-accent-strong lg:self-auto"
          >
            Start a project
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-strong transition-[transform,background-color,color] duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-accent-strong">
              <ArrowUpRight size={16} weight="bold" />
            </span>
          </Link>
        </div>

        <RevealGroup
          stagger={0.09}
          className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 sm:gap-x-10 md:grid-cols-4 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.2fr] lg:gap-x-12"
        >
          <RevealItem className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-flex" aria-label={`${siteConfig.companyLegalName}, home`}>
              <span className="logo-duo h-11 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-fg-inverted-muted">
              Shaheen Automotive (Pvt.) Ltd. designs and manufactures jack assemblies, sheet metal, bent rod and formed pipe components for the automotive and home appliance industries.
            </p>
          </RevealItem>

          <RevealItem>
            <h3 className={headingClasses}>Company</h3>
            <ul className="mt-5 space-y-1.5 pointer-coarse:space-y-0">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem>
            <h3 className={headingClasses}>Products</h3>
            <ul className="mt-5 space-y-1.5 pointer-coarse:space-y-0">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <FooterLink href={l.href}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </RevealItem>

          <RevealItem className="col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className={headingClasses}>Contact</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-fg-inverted-muted">
                <MapPin size={17} className="mt-0.5 shrink-0 text-glow" />
                <span className="min-w-0 wrap-anywhere">
                  {siteConfig.contact.addressLine1}, {siteConfig.contact.addressLine2}, {siteConfig.contact.city}, {siteConfig.contact.country}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-fg-inverted-muted">
                <Phone size={17} className="shrink-0 text-glow" />
                <a
                  href={siteConfig.contact.phoneHref}
                  className="min-w-0 wrap-anywhere py-1 transition-colors hover:text-white pointer-coarse:py-3"
                >
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-fg-inverted-muted">
                <EnvelopeSimple size={17} className="shrink-0 text-glow" />
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="min-w-0 wrap-anywhere py-1 transition-colors hover:text-white pointer-coarse:py-3"
                >
                  {siteConfig.contact.email}
                </a>
              </li>
            </ul>
          </RevealItem>
        </RevealGroup>

        {siteConfig.contact.mapEmbedUrl && (
          <div className="pb-14">
            <div className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03]">
              <iframe
                src={siteConfig.contact.mapEmbedUrl}
                title={`Map showing ${siteConfig.companyLegalName}, ${siteConfig.contact.city}`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
                // kept in full colour so Google's red pin stays easy to spot
                className="block h-64 w-full border-0 sm:h-80"
              />
              {/* the embed centres on the plant, so this pin's tip sits on the exact spot */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-full flex-col items-center"
              >
                <span className="mb-1 whitespace-nowrap rounded-md bg-accent px-2 py-0.5 text-[11px] font-semibold text-white shadow-md">
                  {siteConfig.siteName}
                </span>
                <MapPin
                  size={44}
                  weight="fill"
                  className="text-accent drop-shadow-[0_3px_4px_rgba(0,0,0,0.45)]"
                />
                <span className="absolute -bottom-1 size-3 animate-ping rounded-full bg-accent/60 motion-reduce:animate-none" />
              </div>
              <a
                href={siteConfig.contact.mapLinkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 inline-flex min-h-10 items-center gap-2 rounded-full border border-white/15 bg-black/70 px-4 text-xs font-semibold text-white backdrop-blur transition-colors hover:border-accent hover:bg-accent-strong"
              >
                <MapPin size={14} weight="bold" className="text-glow" />
                Open in Google Maps
                <ArrowUpRight size={12} weight="bold" />
              </a>
            </div>
          </div>
        )}
      </Container>

      <div className="relative border-t border-white/[0.07] py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-center text-xs text-white/60 sm:flex-row sm:gap-6 sm:text-left">
          <p>
            &copy; {year} {siteConfig.companyLegalName}. All rights reserved.
          </p>
        </Container>
      </div>
    </footer>
  );
}
