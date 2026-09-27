import Link from "next/link";
import Image from "next/image";
import {
  EnvelopeSimple,
  MapPin,
  Phone,
  ArrowUpRight,
  LinkedinLogo,
  FacebookLogo,
  InstagramLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/content/site";
import { brand } from "@/content/company";
import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const linkClasses =
  "group inline-flex items-center gap-1.5 py-1 text-sm text-fg-inverted-muted transition-colors duration-200 hover:text-white";
const headingClasses = "tech-label text-white/45";

const columns = [
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Manufacturing", href: "/manufacturing" },
      { label: "Inside the Plant", href: "/facility" },
      { label: "Quality Standards", href: "/quality" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    heading: "Products",
    links: [
      ...siteConfig.productCategories.map((c) => ({ label: c.label, href: `/products/${c.slug}` })),
      { label: "Customers", href: "/customers" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
];

const socials = [
  { label: "LinkedIn", href: siteConfig.social.linkedin, icon: LinkedinLogo },
  { label: "Facebook", href: siteConfig.social.facebook, icon: FacebookLogo },
  { label: "Instagram", href: siteConfig.social.instagram, icon: InstagramLogo },
  { label: "YouTube", href: siteConfig.social.youtube, icon: YoutubeLogo },
].filter((s) => s.href);

export function Footer() {
  const year = new Date().getFullYear();
  const { contact } = siteConfig;

  return (
    <footer className="surface-ink grain relative overflow-hidden">
      {/* oversized mark watermark */}
      <Image
        src={brand.markLight}
        alt=""
        aria-hidden="true"
        width={512}
        height={509}
        className="pointer-events-none absolute -bottom-40 -right-32 w-[34rem] opacity-[0.035] sm:w-[44rem]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent to-transparent" />

      <Container className="relative">
        {/* statement row */}
        <div className="flex flex-col gap-8 border-b border-white/[0.07] pb-12 pt-16 sm:pt-20 lg:flex-row lg:items-end lg:justify-between">
          <p className="max-w-3xl text-balance font-display text-[clamp(1.9rem,1.2rem+2.6vw,3.4rem)] font-bold leading-[1.02] tracking-tight text-white">
            Engineering excellence. <span className="text-metal">Driving the future.</span>
          </p>
          <Link
            href="/contact"
            className="group inline-flex shrink-0 items-center gap-3 self-start rounded-full border border-white/15 bg-white/[0.04] py-2 pl-6 pr-2 text-sm font-semibold text-white transition-colors hover:border-accent hover:bg-accent-ink lg:self-auto"
          >
            Start a project
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-ink transition-[transform,background-color] duration-300 group-hover:rotate-45 group-hover:bg-white group-hover:text-accent-ink">
              <ArrowUpRight size={16} weight="bold" />
            </span>
          </Link>
        </div>

        <RevealGroup
          stagger={0.08}
          className="grid grid-cols-2 gap-x-6 gap-y-12 py-14 sm:gap-x-10 md:grid-cols-4 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.2fr] lg:gap-x-12"
        >
          <RevealItem className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="inline-flex" aria-label={`${siteConfig.companyLegalName}, home`}>
              <span className="logo-duo h-11 w-auto" />
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-fg-inverted-muted">
              Sheet metal, formed pipe and bent rod components for automotive and home appliance OEMs. Designing,
              tooling and manufacturing in Pakistan since 1983.
            </p>
            {socials.length > 0 && (
              <ul className="mt-7 flex gap-2.5" aria-label="Social media">
                {socials.map(({ label, href, icon: Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] text-white/70 transition-[color,border-color,background-color,transform] duration-200 hover:-translate-y-0.5 hover:border-accent hover:bg-accent-ink hover:text-white"
                    >
                      <Icon size={18} weight="fill" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </RevealItem>

          {columns.map((col) => (
            <RevealItem key={col.heading}>
              <h3 className={headingClasses}>{col.heading}</h3>
              <ul className="mt-5 space-y-1.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkClasses}>
                      <span className="h-px w-0 bg-glow transition-[width] duration-300 group-hover:w-3 motion-reduce:transition-none" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </RevealItem>
          ))}

          <RevealItem className="col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className={headingClasses}>Contact</h3>
            <ul className="mt-5 space-y-4">
              <li className="flex items-start gap-3 text-sm text-fg-inverted-muted">
                <MapPin size={18} weight="duotone" className="mt-0.5 shrink-0 text-glow" />
                <span className="min-w-0 wrap-anywhere">
                  {contact.addressLine1}
                  {contact.addressLine2 ? `, ${contact.addressLine2}` : ""}
                  <br />
                  {contact.city}, {contact.country}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-fg-inverted-muted">
                <Phone size={18} weight="duotone" className="shrink-0 text-glow" />
                <a href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} className="min-w-0 wrap-anywhere transition-colors hover:text-white">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-fg-inverted-muted">
                <EnvelopeSimple size={18} weight="duotone" className="shrink-0 text-glow" />
                <a href={`mailto:${contact.email}`} className="min-w-0 wrap-anywhere transition-colors hover:text-white">
                  {contact.email}
                </a>
              </li>
            </ul>
          </RevealItem>
        </RevealGroup>
      </Container>

      <div className="relative border-t border-white/[0.07] py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-center text-xs text-white/40 sm:flex-row sm:gap-6 sm:text-left">
          <p>
            &copy; {year} {siteConfig.companyLegalName}. All rights reserved.
          </p>
          <p className="mono-figure">Company figures as published in the SAPL Profile 2025.</p>
        </Container>
      </div>
    </footer>
  );
}
