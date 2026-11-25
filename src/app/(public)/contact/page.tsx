import { getPageImages } from "@/lib/server/website-images";
import { pageImageKey } from "@/lib/server/website-image-inventory";
import { pageMetadata } from "@/lib/server/seo";
import { getContent } from "@/lib/server/content";
import type { Metadata } from "next";
import { EnvelopeSimple, MapPin, Phone, Clock } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RfqForm } from "@/components/forms/RfqForm";

export async function generateMetadata(): Promise<Metadata> {
  return pageMetadata("/contact", {
  title: "Contact Us",
  description:
    "Send Shaheen Automotive your part drawing or specification for a sheet metal, bent rod or formed pipe component quotation.",
  alternates: { canonical: "/contact" },
});
}

export default async function ContactPage() {
  const images = await getPageImages("contact");
  const { pageHeaders, settings: siteConfig, productCategories } = await getContent();
  return (
    <>
      <PageHeader {...pageHeaders.contact} image={ { ...pageHeaders.contact.image, src: images[pageImageKey("contact", "banner")]?.src || pageHeaders.contact.image.src } } flat />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 sm:gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="min-w-0 space-y-8">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-fg">Contact details</h2>
              <ul className="mt-5 space-y-2">
                <li className="flex items-start gap-3 text-sm text-fg-muted">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-steel" />
                  <span className="min-w-0 wrap-anywhere">
                    {siteConfig.contact.addressLine1}
                    {siteConfig.contact.addressLine2 ? `, ${siteConfig.contact.addressLine2}` : ""}
                    <br />
                    {siteConfig.contact.city}, {siteConfig.contact.country}
                  </span>
                </li>
                <li className="flex items-center gap-3 text-sm text-fg-muted">
                  <Phone size={18} className="shrink-0 text-steel" />
                  <a href={siteConfig.contact.phoneHref} className="inline-flex min-h-11 min-w-0 items-center wrap-anywhere hover:text-fg">
                    {siteConfig.contact.phone}
                  </a>
                </li>
                <li className="flex items-center gap-3 text-sm text-fg-muted">
                  <EnvelopeSimple size={18} className="shrink-0 text-steel" />
                  <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex min-h-11 min-w-0 items-center wrap-anywhere hover:text-fg">
                    {siteConfig.contact.email}
                  </a>
                </li>
                {siteConfig.businessHours && <li className="flex items-start gap-3 text-sm text-fg-muted">
                  <Clock size={18} className="mt-0.5 shrink-0 text-steel" />
                  <span>{siteConfig.businessHours}</span>
                </li>}
              </ul>
            </div>

            <div className="rounded-sm border border-border bg-bg-elevated shadow-soft p-5">
              <h3 className="text-sm font-semibold text-fg">Before you send an RFQ</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-fg-muted">
                <li>Share a drawing or reference part number if you have one.</li>
                <li>Let us know your target annual or monthly volume.</li>
                <li>Tell us your target start-of-production date, if known.</li>
              </ul>
            </div>
            {siteConfig.contact.whatsapp && <a className="text-accent underline" href={siteConfig.contact.whatsapp}>Contact us on WhatsApp</a>}
            {siteConfig.social.linkedin && <a className="block text-accent underline" href={siteConfig.social.linkedin}>Shaheen Automotive on LinkedIn</a>}
          </Reveal>

          <Reveal delay={0.08} className="min-w-0 rounded-sm border border-border bg-bg-elevated p-5 shadow-soft sm:p-8">
            <RfqForm email={siteConfig.contact.email} productCategories={productCategories.filter(({ visible }) => visible).map(({ slug, title }) => ({ slug, label: title }))} />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
