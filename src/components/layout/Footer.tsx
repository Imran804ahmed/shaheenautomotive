import Link from "next/link";
import Image from "next/image";
import { EnvelopeSimple, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/content/site";
import { brand } from "@/content/company";
import { Container } from "@/components/ui/Container";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";

const linkClasses =
  "inline-block py-1 text-sm text-fg-inverted-muted transition-[color,transform] duration-200 hover:translate-x-1 hover:text-fg-inverted motion-reduce:hover:translate-x-0";
const headingClasses = "text-xs font-semibold uppercase tracking-[0.18em] text-brass";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="surface-ink rounded-t-[2.5rem] sm:rounded-t-[3.5rem]">
      <Container>
        <RevealGroup stagger={0.09} className="grid grid-cols-2 gap-x-6 gap-y-10 pb-12 pt-14 sm:gap-x-10 sm:gap-y-12 sm:pb-14 sm:pt-16 md:grid-cols-4 lg:grid-cols-[1.3fr_1fr_1fr_1.1fr] lg:gap-x-12">
        <RevealItem className="col-span-2 md:col-span-4 lg:col-span-1">
          <Link href="/" className="inline-flex" aria-label={`${siteConfig.siteName} home`}>
            <Image src={brand.logoFullLight} alt={siteConfig.companyLegalName} width={1000} height={231} className="h-11 w-auto" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-inverted-muted">
            Sheet metal, formed pipe and bent rod components for automotive and home appliance OEMs, manufacturing in Pakistan since 1983.
          </p>
        </RevealItem>

        <RevealItem>
          <h3 className={headingClasses}>Company</h3>
          <ul className="mt-4 space-y-1.5">
            {[
              { label: "About", href: "/about" },
              { label: "Capabilities", href: "/capabilities" },
              { label: "Inside the Plant", href: "/facility" },
              { label: "Quality", href: "/quality" },
              { label: "Customers", href: "/customers" },
              { label: "Gallery", href: "/gallery" },
            ].map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClasses}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </RevealItem>

        <RevealItem>
          <h3 className={headingClasses}>Products</h3>
          <ul className="mt-4 space-y-1.5">
            {siteConfig.productCategories.map((c) => (
              <li key={c.slug}>
                <Link href={`/products/${c.slug}`} className={linkClasses}>
                  {c.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/contact" className="inline-block py-1 text-sm font-semibold text-brass transition-[color,transform] duration-200 hover:translate-x-1 hover:text-brass-strong motion-reduce:hover:translate-x-0">
                Request a quote
              </Link>
            </li>
          </ul>
        </RevealItem>

        <RevealItem className="col-span-2 lg:col-span-1">
          <h3 className={headingClasses}>Contact</h3>
          <ul className="mt-4 space-y-3.5">
            <li className="flex items-start gap-2.5 text-sm text-fg-inverted-muted">
              <MapPin size={17} className="mt-0.5 shrink-0 text-glow" />
              <span className="min-w-0 wrap-anywhere">
                {siteConfig.contact.addressLine1}, {siteConfig.contact.city}, {siteConfig.contact.country}
              </span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-fg-inverted-muted">
              <Phone size={17} className="shrink-0 text-glow" />
              <span className="min-w-0 wrap-anywhere">{siteConfig.contact.phone}</span>
            </li>
            <li className="flex items-center gap-2.5 text-sm text-fg-inverted-muted">
              <EnvelopeSimple size={17} className="shrink-0 text-glow" />
              <a href={`mailto:${siteConfig.contact.email}`} className="min-w-0 wrap-anywhere transition-colors hover:text-fg-inverted">
                {siteConfig.contact.email}
              </a>
            </li>
          </ul>
        </RevealItem>
        </RevealGroup>
      </Container>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-center text-xs text-fg-inverted-muted sm:flex-row sm:gap-6 sm:text-left">
          <p>
            &copy; {year} {siteConfig.companyLegalName}. All rights reserved.
          </p>
          <p>Company profile figures reflect the SAPL Profile 2025 company deck.</p>
        </Container>
      </div>
    </footer>
  );
}
