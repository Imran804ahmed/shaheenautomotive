/**
 * Central site / business configuration.
 *
 * Everything in this file marked "PLACEHOLDER" is a real, unconfirmed business
 * detail that was NOT present (or not verifiable) in the SAPL Profile 2025
 * source deck. Replace these before launch. See README.md "Before you launch"
 * section for the full checklist.
 */

export const siteConfig = {
  companyLegalName: "Shaheen Automotive (Pvt.) Ltd.",
  companyShortName: "SAPL",
  siteName: "Shaheen Automotive",
  domain: "PLACEHOLDER_DOMAIN.com", // TODO: replace with the live production domain
  baseUrl: "https://PLACEHOLDER_DOMAIN.com", // TODO: used for metadataBase, sitemap, OG tags

  // Optional looping hero background (HLS .m3u8). Leave src empty to show the static hero.
  heroVideo: {
    src: "", // TODO optional: e.g. https://cdn.example.com/hero/master.m3u8
    poster: "",
  },

  tagline: "Sheet metal, pipe and rod components for automotive and home appliance OEMs.",

  // ---- Contact details -------------------------------------------------
  // None of the following were present in the source profile. They are
  // obvious, clearly-labelled placeholders — replace with real details.
  contact: {
    email: "PLACEHOLDER_EMAIL@shaheenautomotive.com.pk", // TODO
    phone: "PLACEHOLDER_PHONE", // TODO e.g. +92 42 XXXX XXXX
    whatsapp: "", // TODO optional
    addressLine1: "PLACEHOLDER_ADDRESS_LINE_1", // TODO e.g. plot / street
    addressLine2: "PLACEHOLDER_ADDRESS_LINE_2", // TODO e.g. industrial area
    city: "PLACEHOLDER_CITY", // TODO
    country: "Pakistan",
    mapEmbedUrl: "", // TODO optional Google Maps embed src
  },

  social: {
    linkedin: "", // TODO
  },

  // ---- RFQ form delivery -------------------------------------------------
  // This is a statically-exported site with no server/API routes, so the RFQ
  // form cannot submit to a database directly. Two supported paths:
  //
  // 1) Configure `rfqFormEndpoint` with a static-form provider endpoint
  //    (e.g. https://formspree.io/f/xxxxxxx, Getform, Basin, etc.). When
  //    set, the form POSTs directly to that endpoint client-side.
  // 2) Leave it empty (default) and the form falls back to building a
  //    pre-filled `mailto:` link to `contact.email`, clearly labelled in
  //    the UI as "opens your email client" — it never claims a submission
  //    happened when nothing was actually sent anywhere.
  rfqFormEndpoint: "", // TODO optional: paste a static-form provider endpoint here

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "Products", href: "/products" },
    { label: "Quality", href: "/quality" },
    { label: "Customers", href: "/customers" },
    { label: "Gallery", href: "/gallery" },
  ],

  productCategories: [
    {
      slug: "sheet-metal-parts",
      label: "Sheet Metal Parts",
    },
    {
      slug: "formed-pipe-parts",
      label: "Formed Pipe Parts",
    },
    {
      slug: "bent-rod-parts",
      label: "Bent Rod Parts",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
