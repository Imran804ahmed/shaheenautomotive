export const siteConfig = {
  companyLegalName: "Shaheen Automotive (Pvt.) Ltd.",
  companyShortName: "SAPL",
  siteName: "Shaheen Automotive",
  domain: "shaheenautomotive.com.pk",
  baseUrl: "https://shaheenautomotive.com.pk",

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

  nav: [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Capabilities", href: "/capabilities" },
    { label: "Products", href: "/products" },
    { label: "Quality", href: "/quality" },
    { label: "CSR", href: "/csr" },
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
