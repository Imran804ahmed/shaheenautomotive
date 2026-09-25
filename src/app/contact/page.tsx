import type { Metadata } from "next";
import { EnvelopeSimple, MapPin, Phone, Clock } from "@phosphor-icons/react/dist/ssr";
import { PageHeader } from "@/components/sections/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { RfqForm } from "@/components/forms/RfqForm";
import { siteConfig } from "@/content/site";

export const metadata: Metadata = {
  title: "Request a Quote",
  description:
    "Send Shaheen Automotive your part drawing or specification for a sheet metal, formed pipe or bent rod component quotation.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Request a quote."
        intro="Tell us about the part and we'll come back with feasibility, process and a quotation. The more detail you share up front, the faster we can respond."
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-10 sm:gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal className="min-w-0 space-y-8">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-fg">Contact details</h2>
              <ul className="mt-5 space-y-4">
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
                  <span className="min-w-0 wrap-anywhere">{siteConfig.contact.phone}</span>
                </li>
                <li className="flex items-center gap-3 text-sm text-fg-muted">
                  <EnvelopeSimple size={18} className="shrink-0 text-steel" />
                  <a href={`mailto:${siteConfig.contact.email}`} className="min-w-0 wrap-anywhere hover:text-fg">
                    {siteConfig.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3 text-sm text-fg-muted">
                  <Clock size={18} className="mt-0.5 shrink-0 text-steel" />
                  <span>Monday &ndash; Saturday, business hours (Pakistan Standard Time)</span>
                </li>
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
          </Reveal>

          <Reveal delay={0.08} className="min-w-0 rounded-sm border border-border bg-bg-elevated p-5 shadow-soft sm:p-8">
            <RfqForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
