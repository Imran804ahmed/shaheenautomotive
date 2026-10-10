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

  tagline: "Jack and Hinges, Sheet Metal, Rods and Pipes for automotive and home appliance OEMs.",

  // ---- Contact details -------------------------------------------------
  contact: {
    email: "info@shaheenautomotive.com.pk",
    phone: "0335 7275111",
    phoneHref: "tel:+923357275111",
    whatsapp: "", // TODO optional
    addressLine1: "DSU-36A Pakistan Steel Industrial Estate",
    addressLine2: "Bin Qasim",
    city: "Karachi",
    country: "Pakistan",
    mapEmbedUrl:
      "https://www.google.com/maps?q=Shaheen+Automotive+Pvt+Ltd.,+Bin+Qasim,+Karachi&ll=24.8297958,67.3427047&z=17&output=embed",
    mapLinkUrl:
      "https://www.google.com/maps/search/?api=1&query=Shaheen+Automotive+Pvt+Ltd.,+Bin+Qasim,+Karachi",
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
    { label: "Gallery", href: "/gallery" },
  ],

  productCategories: [
    {
      slug: "jack-assemblies",
      label: "Jack and Hinges",
    },
    {
      slug: "sheet-metal-parts",
      label: "Sheet Metal",
    },
    {
      slug: "bent-rod-parts",
      label: "Rods",
    },
    {
      slug: "formed-pipe-parts",
      label: "Pipes",
    },
  ],
} as const;

export type SiteConfig = typeof siteConfig;
