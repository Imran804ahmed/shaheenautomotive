/**
 * Company factual content, sourced from "SAPL Profile 2025.pptx" (slides 1-20).
 *
 * Every figure below is presented as-published in that profile deck, not as
 * independently verified current fact. Where the source data was ambiguous,
 * inconsistent, or unverifiable, that is called out explicitly in a `note`
 * field rather than silently resolved, see README.md for the full list.
 */

export type StatItem = {
  value: string;
  label: string;
  sourceNote?: string;
};

export const heroStats: StatItem[] = [
  { value: "350+", label: "Parts in production", sourceNote: "As published in SAPL Profile 2025" },
  { value: "200+", label: "Projects completed" },
  { value: "8+", label: "OEM customer programmes" },
  { value: "100-120", label: "Tons produced / month" },
];

export const history = {
  founded: "July 1983",
  foundedAs: "Shaheen Engineering Works",
  currentName: "Shaheen Automotive (Pvt.) Ltd.",
  narrative: [
    "Shaheen Automotive (Pvt.) Ltd. was founded in July 1983 as Shaheen Engineering Works. Over the following four decades the business evolved from a small engineering works into a private limited company manufacturing more than 350 sheet metal, bent rod and pipe components for Pakistan's automotive and home appliance industries.",
    "SAPL serves leading automotive OEMs and home appliance manufacturers, delivering precision-engineered components tailored to each customer's requirements. The company operates with a production capacity of 100 to 120 tons per month across sheet metal stamping, pipe forming and rod bending processes.",
  ],
};

export const vision =
  "To become a leading manufacturer of sheet metal and pipe components for OEMs in the automotive and home appliance industries.";

export const mission =
  "To provide customer satisfaction in line with expectations, delivered on time, through continuous improvement in manufacturing, production and quality, driven by innovation and ongoing training.";

export const aboutPillars = [
  {
    title: "Solutions",
    body: "Design and development is a core strength: SAPL works alongside customers from concept through to production-ready tooling.",
  },
  {
    title: "Reliable",
    body: "SAPL builds and maintains long-term relationships with its OEM customers, backed by a consistent manufacturing track record.",
  },
  {
    title: "Experience",
    body: "A pioneer in the design, development and production of sheet metal and pipe components for automotive and home appliance OEMs.",
  },
  {
    title: "Affordable",
    body: "Manufacturing services positioned to serve large and medium OEMs alike, balancing quality with cost-effectiveness.",
  },
];

export const aboutStats: StatItem[] = [
  { value: "8+", label: "OEM programmes" },
  { value: "200+", label: "Projects delivered" },
  { value: "350+", label: "Distinct parts manufactured" },
  { value: "100-120", label: "Tons / month capacity" },
];

// ---------------------------------------------------------------------------
// Certifications - deliberately conservative. The source deck references
// "ISO 19001:2008", "ISO 9001:2004" and inconsistent ISO 14001 dates on
// different slides, which cannot be reconciled without the actual
// certificates. Do not present a specific standard + revision + validity
// date as current fact until verified.
// ---------------------------------------------------------------------------
export const certificationsNote = {
  headline: "Quality & environmental management systems",
  body:
    "SAPL's company materials reference ISO 9001 quality management and ISO 14001 environmental management systems, certified under UKAS, Pakistan. The source materials contain inconsistent standard revisions across different documents, so exact certificate numbers, standard revisions and current validity dates are pending verification and will be published here once confirmed.",
  status: "PLACEHOLDER_PENDING_VERIFICATION" as const,
};

export type Award = {
  title: string;
  awardedBy: string;
  year?: string;
  /** Short OEM name for badges, e.g. "Toyota". */
  oem?: string;
  /** Badge label for non-OEM issuers (trade bodies etc.); not counted as an OEM. */
  issuer?: string;
  image?: string;
  imageCaption?: string;
  /** "award" = performance / appreciation award; "recognition" = convention participation or training certificate. */
  category?: "award" | "recognition";
  /** Shown in the home-page recognition strip (keep it to five). */
  featured?: boolean;
};

// Awards named explicitly in the "Certifications & Awards" slide text.
export const namedAwards: Award[] = [
  { title: "Overall Performance Award", awardedBy: "Toyota Indus Motor Company", year: "2014" },
  { title: "Best Quality Performance Award", awardedBy: "Hino Pak Motors", year: "2012" },
  { title: "Timely Development Award", awardedBy: "Toyota Indus Motor Company", year: "2024" },
  { title: "Zero Delay in Delivery Award", awardedBy: "Toyota Indus Motor Company", year: "2012" },
  { title: "Special Effort in Development Award", awardedBy: "Pak Suzuki Motor Co. Ltd.", year: "2012-2014" },
];

// Physical award / trophy / certificate photographs, in chronological order.
// Captions describe only what is legible in each photograph; they are shown as
// a photo record of recognition received, independent of the list above.
export const awardPhotos: Award[] = [
  {
    title: "PAPS 2000 Participation Plaque",
    awardedBy: "PAAPAM and Export Promotion Bureau, Government of Pakistan, Pakistan Auto Parts Show, Karachi, 18-22 January 2000",
    year: "2000",
    issuer: "PAAPAM / EPB",
    image: "/images/awards/paapam-paps-participation-2000.jpg",
    category: "recognition",
  },
  {
    title: "Supplier Participation Plaque",
    awardedBy: "Indus Motor Company Ltd. (Toyota / Daihatsu), presented 29 November 2004",
    year: "2004",
    oem: "Toyota",
    image: "/images/awards/indus-motor-participation-2004.jpg",
    category: "recognition",
  },
  {
    title: "Participation Shield",
    awardedBy: "Indus Motor Company Ltd., Vendors & Suppliers Convention 2006",
    year: "2006",
    oem: "Toyota",
    image: "/images/awards/indus-motor-participation-shield-2006.jpg",
    category: "recognition",
  },
  {
    title: "Delivery Award",
    awardedBy: "Indus Motor Company Ltd., Suppliers Convention 2008, 19 April 2008",
    year: "2008",
    oem: "Toyota",
    image: "/images/awards/indus-motor-delivery-2008.jpg",
    category: "award",
    featured: true,
  },
  {
    title: "Participation Shield",
    awardedBy: "Indus Motor Company Ltd., Suppliers Convention 2008, 19 April 2008",
    year: "2008",
    oem: "Toyota",
    image: "/images/awards/indus-motor-participation-shield-2008.jpg",
    category: "recognition",
  },
  {
    title: "Vendor Appreciation Award",
    awardedBy: "Pak Suzuki Motor Co. Ltd., for efforts in timely development of components (Vendor Conference 2011)",
    year: "2010",
    oem: "Suzuki",
    image: "/images/awards/pak-suzuki-vendor-appreciation-2010.jpg",
    category: "award",
  },
  {
    title: "Special Appreciation Award",
    awardedBy: "Pak Suzuki Motor Co. Ltd., for timely supply of 2-wheeler components during crisis",
    year: "2012",
    oem: "Suzuki",
    image: "/images/awards/pak-suzuki-special-appreciation-2012.jpg",
    category: "award",
    featured: true,
  },
  {
    title: "Special Appreciation Award",
    awardedBy: "Pak Suzuki Motor Co. Ltd., for speedy development of components during crisis",
    year: "2013",
    oem: "Suzuki",
    image: "/images/awards/pak-suzuki-special-appreciation-2013.jpg",
    category: "award",
  },
  {
    title: "Certificate of Appreciation",
    awardedBy: "Hinopak Motors Ltd., Vendors' Convention, 24-25 September 2013",
    year: "2013",
    oem: "Hino",
    image: "/images/awards/hinopak-certificate-of-appreciation-2013.jpg",
    category: "recognition",
    featured: true,
  },
  {
    title: "Overall Performance Award",
    awardedBy: "Indus Motor Company, Suppliers Convention 2014",
    year: "2014",
    oem: "Toyota",
    image: "/images/awards/indus-motor-overall-performance-2014.jpg",
    category: "award",
    featured: true,
  },
  {
    title: "Vendors' Convention Award",
    awardedBy: "Hinopak Motors Ltd., in honour of participation, Karachi, 25 November 2016",
    year: "2016",
    oem: "Hino",
    image: "/images/awards/hinopak-vendors-convention-2016.jpg",
    category: "recognition",
  },
  {
    title: "Factory Management Training Certificate",
    awardedBy: "Pak Suzuki Motor Co. Ltd., Supply Chain Function, Karachi, 19 April 2017",
    year: "2017",
    oem: "Suzuki",
    image: "/images/awards/pak-suzuki-factory-management-training-2017.jpg",
    category: "recognition",
  },
  {
    title: "Supplier Conference Participation Award",
    awardedBy: "Pak Suzuki Motor Co. Ltd., Supplier Conference 2018, held 18 March 2019",
    year: "2018",
    oem: "Suzuki",
    image: "/images/awards/pak-suzuki-supplier-conference-2018.jpg",
    category: "recognition",
  },
  {
    title: "Supplier Conference Participation Award",
    awardedBy: "Pak Suzuki Motor Co. Ltd., Supplier Conference 2019, Marriott Hotel Karachi, 27 February 2020",
    year: "2019",
    oem: "Suzuki",
    image: "/images/awards/pak-suzuki-supplier-conference-2019.jpg",
    category: "recognition",
  },
  {
    title: "Certificate of Participation",
    awardedBy: "Pak Suzuki Motor Co. Ltd., Supplier Conference 2024, Baku, Azerbaijan, 18 April 2024",
    year: "2024",
    oem: "Suzuki",
    image: "/images/awards/pak-suzuki-supplier-conference-2024.jpg",
    category: "recognition",
  },
  {
    title: "Timely Development Award",
    awardedBy: "Indus Motor Company (Toyota), Suppliers Conference 2024",
    year: "2024",
    oem: "Toyota",
    image: "/images/awards/toyota-timely-development-2024.jpg",
    category: "award",
    featured: true,
  },
];

// ---------------------------------------------------------------------------
// Working methodology / development-to-production process
// Reordered from the source slide into logical reading order (source slide
// lists them non-sequentially); wording lightly cleaned for grammar only.
// ---------------------------------------------------------------------------
export type ProcessStep = {
  step: number;
  title: string;
  body: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Feasibility & quotation",
    body: "We analyze the customer's requirement through in-depth research, supported by engineering tools, and submit the best possible proposal.",
  },
  {
    step: 2,
    title: "Design",
    body: "A process and tooling design is developed for efficient, economical mass production of the customer's part.",
  },
  {
    step: 3,
    title: "Development",
    body: "Once design is complete, our development team manufactures tooling using SPM (special-purpose) machines.",
  },
  {
    step: 4,
    title: "Trial production",
    body: "A line verification process is performed in the presence of the customer's team to confirm the facility is ready for mass production.",
  },
  {
    step: 5,
    title: "Inspection",
    body: "After tooling development, an OTS (off-tool sample) is produced and inspected by both the SAPL quality team and the customer's quality department.",
  },
  {
    step: 6,
    title: "Mass production",
    body: "Parts are delivered on time against customer orders, with consistent quality assurance throughout the production run.",
  },
];

// ---------------------------------------------------------------------------
// Capabilities / services
// ---------------------------------------------------------------------------
export type Capability = {
  slug: string;
  title: string;
  body: string;
  /** one-line version for the home page cards */
  summary: string;
  note?: string;
};

export const capabilities: Capability[] = [
  {
    slug: "design-tooling",
    title: "Jigs, Fixtures & Tooling Design",
    body: "In-house jig and tool design capability, from simple jigs to more complex fixtures, built to suit each customer's product and process requirements.",
    summary: "In-house design of jigs, fixtures and tooling for each customer's parts.",
  },
  {
    slug: "press-shop",
    title: "Sheet Metal Stamping",
    body: "A sheet metal parts process facility manufacturing automotive components to production quality, across a mechanical, hydraulic and pneumatic press fleet.",
    summary: "Automotive parts stamped on mechanical, hydraulic and pneumatic presses.",
  },
  {
    slug: "pipe-shop",
    title: "Pipe Bending & Flaring",
    body: "Skilled labor and automated NC / CNC pipe bending equipment producing formed pipe parts with high efficiency across a wide diameter range.",
    summary: "NC / CNC pipe bending across a wide diameter range.",
  },
  {
    slug: "welding",
    title: "Welding & Assembly",
    body: "A range of welding processes, including machine welding, applied in production to suit the standards and practices required by each customer.",
    summary: "A range of welding processes, including machine welding.",
  },
  {
    slug: "surface-finishing",
    title: "Galvanizing & Powder Coating",
    body: "A hot-dip galvanizing process and powder coating capability operated under quality control to ASTM standards.",
    summary: "Hot-dip galvanizing and powder coating to ASTM standards.",
    note: "Current operating status of this facility should be reconfirmed before publishing without qualification.",
  },
  {
    slug: "inspection",
    title: "Dimensional Inspection",
    body: "FARO measurement solutions for manual and automated inspection of individual parts, sub-components and final assemblies.",
    summary: "FARO measurement of parts, sub-components and assemblies.",
  },
];

// ---------------------------------------------------------------------------
// Machines & equipment (slides 14-18)
// ---------------------------------------------------------------------------
export type Equipment = {
  name: string;
  detail?: string;
  qty?: string;
};

export const equipmentDesignDev: Equipment[] = [
  { name: "Design software: Unigraphics (UG NX) 11.0" },
  { name: "PTC Creo 3.0" },
  { name: "AutoForm 11.0" },
  { name: "CNC Wire Cut machines" },
  { name: "CNC Auto-Lathe" },
  { name: "Lathe machines" },
  { name: "CNC machine: Hartford PRO1000" },
  { name: "CNC machine: DMTG XD40A" },
  { name: "Shaper machine" },
];

export const equipmentPressShop: Equipment[] = [
  { name: "Hydraulic press", qty: "2", detail: "150 and 250 tons" },
  { name: "Mechanical press", qty: "21", detail: "15-100 tons" },
  { name: "Pneumatic press", qty: "32", detail: "25-300 tons" },
];

export const equipmentPipeShop: Equipment[] = [
  { name: "NC pipe bending machine", detail: "Taiwan, ø10 to ø30 mm" },
  { name: "CNC pipe bending machine", detail: "Taiwan, ø10 to ø38 x 2.5 mm wall" },
  { name: "Hydraulic pipe flaring machine", detail: "ø10 to ø28 mm" },
];

export const equipmentWeldingShop: Equipment[] = [
  { name: "CO₂ welding machine", qty: "11", detail: "England" },
  { name: "Spot welding machine", qty: "7", detail: "England" },
  { name: "Gas welding", qty: "3" },
  { name: "ARC welding machine", qty: "2", detail: "England" },
  { name: "Induction welding", qty: "2" },
];

export const equipmentInspection: Equipment[] = [
  { name: "FARO Arm with laser scanner" },
  { name: "Pull & push gauge" },
  { name: "Height gauges" },
  { name: "Micrometers" },
  { name: "Digital vernier calipers" },
];

export const pressShopTotal = {
  machines:
    equipmentPressShop.reduce((sum, e) => sum + Number(e.qty ?? 0), 0),
  tonnageRange: "15-300 tons",
};

export const weldingShopTotal = {
  machines: equipmentWeldingShop.reduce((sum, e) => sum + Number(e.qty ?? 0), 0),
};

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
export type ProductPhoto = { src: string; alt: string };

export type ProductProgram = {
  oemName: string;
  oemSlug: string;
  logo: string;
  summary: string;
  namedParts: string[];
  hasVerifiedExamples: boolean;
};

export const productPrograms: ProductProgram[] = [
  {
    oemName: "Indus Motor Company (Toyota Pakistan)",
    oemSlug: "toyota",
    logo: "/images/clients/toyota.png",
    summary:
      "SAPL manufactures a range of sheet metal and pipe parts fitted to Toyota passenger car models built in Pakistan.",
    namedParts: [
      "Support Radiator",
      "Bend Assy",
      "Luggage Hinges",
      "Frame Back Window",
      "Qtr Wheel House",
      "Panel Room Partition",
    ],
    hasVerifiedExamples: true,
  },
  {
    oemName: "Pak Suzuki Motor Co. Ltd.",
    oemSlug: "suzuki",
    logo: "/images/clients/suzuki.png",
    summary:
      "SAPL manufactures a range of sheet metal and pipe parts fitted to Pak Suzuki Motor Co. Ltd. (PSMCL) vehicle models.",
    namedParts: [
      "Paddle Bracket",
      "Hood Assy, Fr Hinges",
      "Jack Assembly Parts",
      "Pipe Comp Water Inlet",
      "Carrier Spare Wheel",
      "Gear Shifter",
    ],
    hasVerifiedExamples: true,
  },
  {
    oemName: "Yamaha Motorcycle Pakistan",
    oemSlug: "yamaha",
    logo: "/images/clients/yamaha.png",
    summary:
      "SAPL manufactures a range of bent rod and sheet metal parts fitted to Yamaha motorcycle models built in Pakistan.",
    namedParts: [
      "Main Stand",
      "Stay Engine",
      "Bracket",
      "Bracket Main Stand",
      "Bracket Bend",
      "Side Stand",
    ],
    hasVerifiedExamples: true,
  },
];

export type ProductCategory = {
  slug: "jack-assemblies" | "sheet-metal-parts" | "formed-pipe-parts" | "bent-rod-parts";
  title: string;
  shortTitle: string;
  summary: string;
  processTags: string[];
  /** optional photo backdrop for the category page hero */
  heroImage?: { src: string; position?: string };
};

export const productCategories: ProductCategory[] = [
  {
    slug: "jack-assemblies",
    title: "Jacks",
    shortTitle: "Jacks",
    summary:
      "Zinc-plated scissor jacks and jack assembly parts, stamped, formed and assembled in-house, including jack assembly parts supplied to Pak Suzuki programmes.",
    processTags: ["Stamping & forming", "Lead-screw assembly", "Zinc-plated finish", "Dimensional inspection"],
    heroImage: { src: "/images/facility/floor/enhanced/jack-assembly-hero.jpg", position: "center 85%" },
  },
  {
    slug: "sheet-metal-parts",
    title: "Sheet Metal",
    shortTitle: "Sheet Metal",
    summary:
      "Stamped and formed sheet metal components, produced across a mechanical, hydraulic and pneumatic press fleet ranging from 15 to 300 tons, for automotive and home appliance OEMs.",
    processTags: ["Stamping", "Progressive & line dies", "Welded assemblies", "Dimensional inspection"],
    heroImage: { src: "/images/facility/floor/enhanced/press-shop-hall.jpg", position: "60% 65%" },
  },
  {
    slug: "bent-rod-parts",
    title: "Rods",
    shortTitle: "Rods",
    summary:
      "Bent rod components and assemblies, including stands, brackets and structural rod parts, primarily supplied to motorcycle OEM programmes.",
    processTags: ["Rod bending", "Bracket welding", "Surface finishing", "Dimensional inspection"],
    heroImage: { src: "/images/products/hero/bent-rods-bin.webp", position: "60% center" },
  },
  {
    slug: "formed-pipe-parts",
    title: "Pipes",
    shortTitle: "Pipes",
    summary:
      "NC and CNC pipe bending and hydraulic pipe flaring, producing formed pipe components across a ø10-ø38 mm diameter range for automotive applications.",
    processTags: ["NC / CNC bending", "Pipe flaring", "Welding & assembly", "Dimensional inspection"],
    heroImage: { src: "/images/facility/floor/pipe-bending-cell.jpg", position: "70% center" },
  },
];

// Photo galleries per product category. Photographs are grouped by the
// manufacturing form visible in the image itself (a scissor jack vs. a
// stamped panel vs. a bent tube vs. a bent solid rod), not by matching to a
// specific named part, since the source deck does not pair individual photos
// with individual part names. Pipe and jack galleries add shop-floor shots
// where there are few product photographs.
export const categoryPhotos: Record<ProductCategory["slug"], ProductPhoto[]> = {
  "jack-assemblies": [
    { src: "/images/products/showcase/showcase-1.jpg", alt: "Zinc-plated scissor jack assembly with lead screw" },
    { src: "/images/products/showcase/showcase-31.jpg", alt: "Yellow zinc scissor jack with riveted saddle, lead screw and clevis drive end" },
    { src: "/images/products/showcase/showcase-33.jpg", alt: "Zinc-plated scissor jack with formed saddle, black lead screw and eye drive end" },
    { src: "/images/products/showcase/showcase-35.jpg", alt: "Zinc-plated scissor jack with formed saddle and hex drive end" },
    { src: "/images/products/showcase/showcase-37.jpg", alt: "Zinc-plated scissor jack with slotted saddle and flat drive end" },
    { src: "/images/products/showcase/showcase-32.jpg", alt: "Yellow zinc scissor jack from an angled view" },
    { src: "/images/products/showcase/showcase-34.jpg", alt: "Zinc-plated scissor jack with box saddle, black lead screw and eye drive end" },
    { src: "/images/products/showcase/showcase-36.jpg", alt: "Zinc-plated scissor jack with slotted box saddle and hex drive end" },
  ],
  "sheet-metal-parts": [
    { src: "/images/products/showcase/showcase-9.jpg", alt: "Stamped sheet metal panel with punched mounting holes" },
    { src: "/images/products/showcase/showcase-21.jpg", alt: "Deep-drawn frame bracket with large central cut-out and flanged edges" },
    { src: "/images/products/showcase/showcase-25.jpg", alt: "Ribbed support plate with flanged opening and embossed weld-nut boss" },
    { src: "/images/products/showcase/showcase-2.jpg", alt: "Zinc-plated hood hinge arm with pivot bracket" },
    { src: "/images/products/showcase/showcase-17.jpg", alt: "Deep-drawn channel bracket with ribbed flanges and pierced holes" },
    { src: "/images/products/showcase/showcase-28.jpg", alt: "Zinc-coated long reinforcement rail with pierced holes and ribbed side flanges" },
    { src: "/images/products/showcase/showcase-7.jpg", alt: "Stamped side member rail with pierced holes and formed end flanges" },
    { src: "/images/products/showcase/showcase-13.jpg", alt: "Stamped mounting plate with a central round opening and four bolt holes" },
    { src: "/images/products/showcase/showcase-15.jpg", alt: "Formed sheet metal bracket with stepped ribs and pierced mounting tabs" },
    { src: "/images/products/showcase/showcase-19.jpg", alt: "Deep-formed curved panel with flanged edges and pierced holes" },
    { src: "/images/products/showcase/showcase-23.jpg", alt: "Stamped skid plate with ribbed side flanges, formed tabs and a central boss" },
    { src: "/images/products/showcase/showcase-29.jpg", alt: "Long stamped cross member with embossed ribs and pierced holes" },
    { src: "/images/products/studio/coated-tank-strap.jpg", alt: "Black-coated formed steel tank strap with mounting studs" },
    { src: "/images/products/studio/stamped-brackets.jpg", alt: "Pair of stamped zinc-plated brackets with pierced holes and folded tabs" },
    { src: "/images/products/studio/pierced-side-rail.jpg", alt: "Long stamped rail with embossed flanges, slots and pierced holes" },
    { src: "/images/products/studio/curved-reinforcement.jpg", alt: "Curved stamped reinforcement with embossed ribs and mounting holes" },
    { src: "/images/products/studio/skid-plate.jpg", alt: "Stamped under guard plate with ribbed body and hole pattern" },
    { src: "/images/products/studio/skid-plate-studs.jpg", alt: "Stamped guard plate with welded mounting studs" },
    { src: "/images/products/studio/coated-tank-strap-alt.jpg", alt: "Black-coated formed steel tank strap with mounting studs, alternate view" },
    { src: "/images/products/studio/cross-member-panel.jpg", alt: "Stamped cross member panel with formed openings and pierced holes" },
    { src: "/images/products/studio/channel-rail.jpg", alt: "Tapered stamped channel rail with stiffening beads" },
    { src: "/images/products/studio/heat-shield-panel.jpg", alt: "Stamped heat shield panel with welded studs, flanged openings and a four-bolt port" },
    { src: "/images/products/studio/shield-bracket-nuts.jpg", alt: "Deep-formed shield bracket with projection-welded nuts" },
    { src: "/images/products/studio/shield-bracket-reverse.jpg", alt: "Deep-formed shield bracket with embossed ribs, reverse side" },
  ],
  "bent-rod-parts": [
    { src: "/images/products/studio/bent-rods.jpg", alt: "Zinc-plated bent rod hooks and a jack handle with rubber grip" },
    { src: "/images/facility/floor/bent-rod-parts-bin.jpg", alt: "Steel bin filled with finished bent rod parts with flattened, pierced ends" },
  ],
  "formed-pipe-parts": [
    { src: "/images/products/studio/zinc-coolant-pipe.jpg", alt: "Zinc-plated branched coolant pipe with formed ends and brackets" },
    { src: "/images/products/studio/yellow-zinc-branched-pipe.jpg", alt: "Yellow zinc branched coolant pipe with welded clamp brackets" },
    { src: "/images/products/studio/zinc-flanged-pipe.jpg", alt: "Zinc-plated formed pipe with a two-hole flange and welded bracket" },
    { src: "/images/products/studio/black-coolant-pipe.jpg", alt: "Black formed coolant pipe with a welded mounting clip" },
    { src: "/images/products/studio/pipe-assembly.jpg", alt: "Yellow zinc coolant pipe assembly joined by welded brackets" },
    { src: "/images/products/studio/pipe-assembly-alt.jpg", alt: "Yellow zinc-plated pipe assembly with clamp brackets" },
    { src: "/images/products/studio/formed-pipe-flange.jpg", alt: "Black formed pipe with a two-hole mounting flange" },
    { src: "/images/products/studio/formed-pipe-flange-reverse.jpg", alt: "Black formed pipe with two-hole mounting flange, reverse view" },
    { src: "/images/products/studio/welded-tube-bracket.jpg", alt: "Black tubular bracket with welded cross members" },
    { src: "/images/products/studio/tube-frame-tabs.jpg", alt: "Black square tube frame with welded, pierced mounting tabs" },
    { src: "/images/products/studio/double-loop-tube-frame.jpg", alt: "Black double-loop tube frame with flattened, pierced mounting ends" },
    { src: "/images/products/studio/tube-grab-rail.jpg", alt: "Black tube grab rail with flattened, pierced ends" },
  ],
};

// Filterable product gallery on /products: one tab per product family.
// Studio product photographs (no older OEM snapshots); Rods adds one
// shop-floor shot of finished parts, as it has a single studio photo. The first
// photo in each family becomes the large feature tile when that tab is
// selected, so each family leads with a high-resolution shot.
export const productGalleryCategories: PhotoCategory[] = productCategories.map((c) => ({
  key: c.slug,
  label: c.title,
}));

// studio product shots, exported from the full-resolution originals
const studioShot = (file: string, category: ProductCategory["slug"], caption: string, alt: string): GalleryPhoto => ({
  src: `/images/products/studio/${file}.jpg`,
  category,
  caption,
  alt,
});

export const productGalleryPhotos: GalleryPhoto[] = [
  // jack assemblies
  { src: "/images/products/showcase/showcase-1.jpg", category: "jack-assemblies", caption: "Scissor Jack Assembly", alt: "Zinc-plated scissor jack assembly with lead screw" },
  { src: "/images/products/showcase/showcase-31.jpg", category: "jack-assemblies", caption: "Scissor Jack, Yellow Zinc", alt: "Yellow zinc scissor jack with riveted saddle, lead screw and clevis drive end" },
  { src: "/images/products/showcase/showcase-33.jpg", category: "jack-assemblies", caption: "Scissor Jack with Formed Saddle", alt: "Zinc-plated scissor jack with formed saddle, black lead screw and eye drive end" },
  { src: "/images/products/showcase/showcase-35.jpg", category: "jack-assemblies", caption: "Scissor Jack with Hex Drive", alt: "Zinc-plated scissor jack with formed saddle and hex drive end" },
  { src: "/images/products/showcase/showcase-37.jpg", category: "jack-assemblies", caption: "Scissor Jack with Slotted Saddle", alt: "Zinc-plated scissor jack with slotted saddle and flat drive end" },
  { src: "/images/products/showcase/showcase-32.jpg", category: "jack-assemblies", caption: "Scissor Jack, Angled View", alt: "Yellow zinc scissor jack from an angled view" },

  // sheet metal parts
  studioShot("cross-member-panel", "sheet-metal-parts", "Cross Member Panel", "Stamped cross member panel with formed openings and pierced holes"),
  studioShot("pierced-side-rail", "sheet-metal-parts", "Pierced Side Rail", "Long stamped rail with embossed flanges, slots and pierced holes"),
  studioShot("curved-reinforcement", "sheet-metal-parts", "Curved Reinforcement", "Curved stamped reinforcement with embossed ribs and mounting holes"),
  studioShot("skid-plate", "sheet-metal-parts", "Under Guard Plate", "Stamped under guard plate with ribbed body and hole pattern"),
  studioShot("skid-plate-studs", "sheet-metal-parts", "Guard Plate with Studs", "Stamped guard plate with welded mounting studs"),
  studioShot("channel-rail", "sheet-metal-parts", "Channel Rail", "Tapered stamped channel rail with stiffening beads"),
  studioShot("channel-rail-reverse", "sheet-metal-parts", "Channel Rail, Reverse", "Tapered stamped channel rail, reverse side"),
  studioShot("stamped-brackets", "sheet-metal-parts", "Stamped Brackets", "Pair of stamped zinc-plated brackets with pierced holes and folded tabs"),
  studioShot("coated-tank-strap", "sheet-metal-parts", "Coated Tank Strap", "Black-coated formed steel strap with mounting studs"),
  studioShot("coated-tank-strap-alt", "sheet-metal-parts", "Coated Tank Strap, Alternate View", "Black-coated formed steel strap with mounting studs, alternate view"),
  studioShot("heat-shield-panel", "sheet-metal-parts", "Heat Shield Panel", "Stamped heat shield panel with welded studs, flanged openings and a four-bolt port"),
  studioShot("shield-bracket-nuts", "sheet-metal-parts", "Shield Bracket with Weld Nuts", "Deep-formed shield bracket with projection-welded nuts"),
  studioShot("shield-bracket-reverse", "sheet-metal-parts", "Shield Bracket, Reverse", "Deep-formed shield bracket with embossed ribs, reverse side"),
  { src: "/images/products/showcase/showcase-21.jpg", category: "sheet-metal-parts", caption: "Frame Bracket with Cut-Out", alt: "Deep-drawn frame bracket with large central cut-out and flanged edges" },
  { src: "/images/products/showcase/showcase-9.jpg", category: "sheet-metal-parts", caption: "Stamped Sheet Metal Panel", alt: "Stamped sheet metal panel with punched mounting holes" },
  { src: "/images/products/showcase/showcase-25.jpg", category: "sheet-metal-parts", caption: "Ribbed Support Plate", alt: "Ribbed support plate with flanged opening and embossed weld-nut boss" },
  { src: "/images/products/showcase/showcase-2.jpg", category: "sheet-metal-parts", caption: "Hood Hinge Assembly", alt: "Zinc-plated hood hinge arm with pivot bracket" },
  { src: "/images/products/showcase/showcase-17.jpg", category: "sheet-metal-parts", caption: "Channel Bracket", alt: "Deep-drawn channel bracket with ribbed flanges and pierced holes" },
  { src: "/images/products/showcase/showcase-28.jpg", category: "sheet-metal-parts", caption: "Long Reinforcement Rail", alt: "Zinc-coated long reinforcement rail with pierced holes and ribbed side flanges" },

  // bent rod parts
  studioShot("bent-rods", "bent-rod-parts", "Bent Rod Hooks & Jack Handle", "Zinc-plated bent rod hooks and a jack handle with rubber grip"),
  { src: "/images/facility/floor/bent-rod-parts-bin.jpg", category: "bent-rod-parts", caption: "Finished Bent Rods", alt: "Steel bin filled with finished bent rod parts with flattened, pierced ends" },

  // formed pipe parts
  studioShot("zinc-coolant-pipe", "formed-pipe-parts", "Branched Coolant Pipe", "Zinc-plated branched coolant pipe with formed ends and brackets"),
  studioShot("yellow-zinc-branched-pipe", "formed-pipe-parts", "Branched Coolant Pipe, Yellow Zinc", "Yellow zinc branched coolant pipe with welded clamp brackets"),
  studioShot("zinc-flanged-pipe", "formed-pipe-parts", "Flanged Coolant Pipe", "Zinc-plated formed pipe with a two-hole flange and welded bracket"),
  studioShot("black-coolant-pipe", "formed-pipe-parts", "Formed Coolant Pipe", "Black formed coolant pipe with a welded mounting clip"),
  studioShot("pipe-assembly", "formed-pipe-parts", "Coolant Pipe Assembly", "Yellow zinc coolant pipe assembly joined by welded brackets"),
  studioShot("pipe-assembly-alt", "formed-pipe-parts", "Coolant Pipe Assembly, Alternate View", "Yellow zinc-plated pipe assembly with clamp brackets"),
  studioShot("formed-pipe-flange", "formed-pipe-parts", "Formed Pipe with Flange", "Black formed pipe with a two-hole mounting flange"),
  studioShot("formed-pipe-flange-reverse", "formed-pipe-parts", "Formed Pipe with Flange, Reverse", "Black formed pipe with two-hole mounting flange, reverse view"),
  studioShot("welded-tube-bracket", "formed-pipe-parts", "Welded Tube Bracket", "Black tubular bracket with welded cross members"),
  studioShot("tube-frame-tabs", "formed-pipe-parts", "Square Tube Frame with Tabs", "Black square tube frame with welded, pierced mounting tabs"),
  studioShot("double-loop-tube-frame", "formed-pipe-parts", "Double-Loop Tube Frame", "Black double-loop tube frame with flattened, pierced mounting ends"),
  studioShot("tube-grab-rail", "formed-pipe-parts", "Tube Grab Rail", "Black tube grab rail with flattened, pierced ends"),

];

// ---------------------------------------------------------------------------
// Customers
// ---------------------------------------------------------------------------
export type Client = {
  name: string;
  logo: string;
  hasVerifiedExamples: boolean;
};

export const clients: Client[] = [
  { name: "Toyota", logo: "/images/clients/toyota.png", hasVerifiedExamples: true },
  { name: "Pak Suzuki", logo: "/images/clients/suzuki.png", hasVerifiedExamples: true },
  { name: "Yamaha", logo: "/images/clients/yamaha.png", hasVerifiedExamples: true },
  { name: "Hino Pak Motors", logo: "/images/clients/hino.png", hasVerifiedExamples: false },
  { name: "Nissan", logo: "/images/clients/nissan.png", hasVerifiedExamples: false },
  { name: "Changan", logo: "/images/clients/changan.png", hasVerifiedExamples: false },
  { name: "Kia", logo: "/images/clients/kia.png", hasVerifiedExamples: false },
  { name: "Agriauto Stamping Company", logo: "/images/clients/agriauto.png", hasVerifiedExamples: false },
];

export const industriesServed = [
  "Automotive OEM, passenger cars",
  "Automotive OEM, motorcycles",
  "Home appliance manufacturing",
];

// ---------------------------------------------------------------------------
// Genuine facility photography (only photos confirmed to be SAPL's own,
// not stock / vendor catalog imagery).
// ---------------------------------------------------------------------------
export const facilityPhotos = [
  {
    src: "/images/facility/hydraulic-press-operator.jpeg",
    alt: "SAPL press shop operator running an SPM Controls hydraulic stamping press on the production floor",
  },
];

// ---------------------------------------------------------------------------
// Leadership
//
// HOW TO UPDATE — this is the single place that drives the "Our Leadership"
// section (src/components/sections/Leadership.tsx, shown on /about):
//   - The FIRST entry in the array is always the featured / most-highlighted
//     card (larger portrait, full bio). Every entry after it renders in the
//     normal-weight grid (smaller portrait, name + title only). Reorder the
//     array to change who's featured.
//   - name / title / bio: replace the placeholder strings with the real,
//     verified name, designation and a 2-3 sentence introduction. `bio` is
//     only displayed for the featured (first) entry.
//   - quote: optional, featured entry only. Leave `undefined` unless you
//     have real words from that person.
//   - photo: leave `undefined` to keep showing the placeholder portrait, or
//     set it once the image file exists, e.g. "/images/leadership/director.jpg".
//     Drop the actual photo file into public/images/leadership/ under that
//     same name. Recommended: a portrait-orientation photo (4:5 ratio or
//     taller, ~1200px+ on the long edge) so it crops cleanly on all screens.
//   - isPlaceholder: set to `false` once name, title, bio and photo are all
//     real — this only controls the "placeholder" badge shown on the card.
// ---------------------------------------------------------------------------
export type LeadershipMember = {
  slug: string;
  name: string;
  title: string;
  bio: string;
  quote?: string;
  photo?: string;
  photoAlt: string;
  isPlaceholder: boolean;
};

export const leadership: LeadershipMember[] = [
  {
    slug: "ceo",
    name: "Mazhar Saeed Bhatti",
    title: "Founder & CEO",
    bio: "Add a 2-3 sentence introduction here: the CEO's role at Shaheen Automotive, their background, and what they focus on.",
    quote: undefined,
    photo: "/images/leadership/director-main.jpg",
    photoAlt: "Portrait of Mazhar Saeed Bhatti, Founder & CEO of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "ceo-2",
    name: "Azhar Saeed Bhatti (Late)",
    title: "Founder",
    bio: "Add a 2-3 sentence introduction here: the CEO's role at Shaheen Automotive, their background, and what they focus on.",
    quote: undefined,
    photo: "/images/leadership/azhar-saeed-bhatti.jpg",
    photoAlt: "Portrait of Azhar Saeed Bhatti, Founder of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "director-5",
    name: "Nasir Mazhar",
    title: "Director Technical",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/board-5-new.jpg",
    photoAlt: "Portrait of Nasir Mazhar, Director Technical of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "director-3",
    name: "Fahad Mazhar",
    title: "Managing Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/board-3.jpg",
    photoAlt: "Portrait of Fahad Mazhar, Managing Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "director-4",
    name: "Bilal Azhar",
    title: "Director IT & HSE",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/board-4.jpg",
    photoAlt: "Portrait of Bilal Azhar, Director IT & HSE of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "director-2",
    name: "Salman Azhar",
    title: "Director Marketing & Finance",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/board-2.jpg",
    photoAlt: "Portrait of Salman Azhar, Director Marketing & Finance of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "director-1",
    name: "Asad Mazhar",
    title: "Director HR, Corporate & Legal Affairs",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/board-1.jpg",
    photoAlt: "Portrait of Asad Mazhar, Director HR, Corporate & Legal Affairs of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
];

/** Management team: shown as its own grid after the board of directors. Same fields as `leadership`; `bio` is not displayed. */
export const managementTeam: LeadershipMember[] = [
  {
    slug: "management-1",
    name: "Muhammad Abbas",
    title: "General Manager (Plant)",
    bio: "",
    photo: "/images/leadership/management-1.jpg",
    photoAlt: "Portrait of Muhammad Abbas, General Manager (Plant) of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "management-6",
    name: "Naveed Ali",
    title: "Senior Manager QA/QC",
    bio: "",
    photo: "/images/leadership/management-6.jpg",
    photoAlt: "Portrait of Naveed Ali, Senior Manager QA/QC of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
   {
    slug: "management-3",
    name: "Imran Hussain",
    title: "Manager Tool & Dies",
    bio: "",
    photo: "/images/leadership/management-3.jpg",
    photoAlt: "Portrait of Imran Hussain, Manager Tool & Dies of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "management-4",
    name: "Mohsin Abrar",
    title: "Manager Design & Development",
    bio: "",
    photo: "/images/leadership/management-4.jpg",
    photoAlt: "Portrait of Mohsin Abrar, Manager Design & Development of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "management-5",
    name: "Murad Muhammad Khan",
    title: "Deputy Manager Production",
    bio: "",
    photo: "/images/leadership/management-5.jpg",
    photoAlt: "Portrait of Murad Muhammad Khan, Deputy Manager Production of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },
  {
    slug: "management-2",
    name: "Abdul Salam Qureshi",
    title: "Manager Finance & Accounts, HR / Admin",
    bio: "",
    photo: "/images/leadership/management-2.jpg",
    photoAlt: "Portrait of Abdul Salam Qureshi, Manager Finance & Accounts, HR / Admin of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: false,
  },

];

export const brand = {
  logoFull: "/images/brand/sapl-logo-full.png",
  mark: "/images/brand/sapl-mark.png",
  logoFullLight: "/images/brand/sapl-logo-full-light.png",
  markLight: "/images/brand/sapl-mark-light.png",
};

// ---------------------------------------------------------------------------
// Gallery
// ---------------------------------------------------------------------------
export type PhotoCategory = { key: string; label: string };
export type GalleryCategory = { key: "press-shop" | "cnc-machining" | "welding-finishing" | "quality-stores"; label: string };

export const galleryCategories: GalleryCategory[] = [
  { key: "press-shop", label: "Press Shop" },
  { key: "cnc-machining", label: "CNC Machining" },
  { key: "welding-finishing", label: "Welding & Finishing" },
  { key: "quality-stores", label: "Quality & Stores" },
];

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
  category: string;
  /** blur-up placeholder, attached server-side with withBlur() from @/lib/image-meta */
  blurDataURL?: string;
};

/** Plant photography reused from /images/facility/floor. */
const galleryPhoto = (file: string, category: GalleryCategory["key"], caption: string, alt: string): GalleryPhoto => ({
  src: `/images/facility/floor/${file}.jpg`,
  category,
  caption,
  alt,
});

export const galleryPhotos: GalleryPhoto[] = [
  galleryPhoto("press-shop-hall", "press-shop", "The Press Shop", "Wide view of the press shop hall with rows of presses, operators and stacks of sheet metal blanks"),
  galleryPhoto("cnc-machining-bay", "cnc-machining", "CNC Machining Bay", "Row of CNC vertical machining centres on a green epoxy floor, with a DMTG XD-40A in front"),
  galleryPhoto("welding-and-spot-welding-shop", "welding-finishing", "Welding and Spot Welding Shop", "Welding shop with MIG welding benches and a row of spot welding machines"),
  galleryPhoto("qa-qc-lab", "quality-stores", "QA & QC Lab", "Entrance to the QA & QC lab beside the production office, with racks of finished parts outside"),
  galleryPhoto("komatsu-press", "press-shop", "Komatsu 200 Press", "Komatsu straight-side press with a die set in the bed and die racks alongside"),
  galleryPhoto("primed-steel-frames", "welding-finishing", "Primed Steel Frames", "Rows of welded steel frames finished in red primer on the shop floor"),
  galleryPhoto("warehouse-bay", "quality-stores", "Warehouse Bay", "Warehouse bay with stacked SAPL part bins, wire cages of formed parts and a delivery truck"),
  galleryPhoto("chin-fong-press", "press-shop", "Chin Fong Press No. 42", "Chin Fong straight-side press, machine number 42, with a die set in the bed"),
  galleryPhoto("cnc-machining-centre", "cnc-machining", "DMTG XD-40A Machining Centre", "DMTG XD-40A vertical machining centre, CNC 1, with its control panel beside a second machining centre"),
  galleryPhoto("surface-activation-tank", "welding-finishing", "Surface Activation Tank", "Motor-driven perforated barrel sitting in a surface activation tank"),
  galleryPhoto("storage-hall-bins", "quality-stores", "Storage Hall", "Storage hall with colour-coded steel bins in front of parts racks"),
  galleryPhoto("straight-side-press-front", "press-shop", "Cowlishaw Walker Press", "Cowlishaw Walker straight-side press flanked by bins of formed parts"),
  galleryPhoto("surface-activation-line", "welding-finishing", "Barrel Tanks", "Two barrel tanks against the wall under caustic hazard and surface activation signs"),
  galleryPhoto("storage-area", "quality-stores", "Storage Area", "Entrance to the storage area with steel bins and part trolleys"),
  galleryPhoto("heavy-press", "press-shop", "Heavy Press", "Large straight-side press with its bolster exposed, cordoned off with safety tape"),
  galleryPhoto("bent-rod-parts-bin", "quality-stores", "Bent Rod Parts", "Steel bin filled with bent rod parts with flattened, pierced ends"),
];

// ---------------------------------------------------------------------------
// Shop floor: SAPL's own photography of machines and people at work.
// Drives /facility and the home-page ShopFloor section.
// ---------------------------------------------------------------------------
export type FloorArea = PhotoCategory & {
  number: string;
  body: string;
  cover: string;
  coverAlt: string;
};

export const floorAreas: FloorArea[] = [
  {
    key: "press-shop",
    label: "Press Shop",
    number: "01",
    body: "Lines of mechanical power presses pierce, trim and form sheet metal and pipe parts. Operators load every stroke by hand and stack finished parts at the station for the next operation.",
    cover: "/images/facility/floor/enhanced/press-line-ppe.jpg",
    coverAlt: "Operators in hard hats and safety vests running a line of mechanical power presses in the SAPL press shop",
  },
  {
    key: "mig-welding",
    label: "MIG Welding",
    number: "02",
    body: "Welders join formed pipe assemblies on dedicated fixtures that hold every tube in position, so each assembly is welded to the same geometry, batch after batch.",
    cover: "/images/facility/floor/enhanced/mig-welding-fixture.jpg",
    coverAlt: "Welder in a cap and safety glasses MIG welding a pipe assembly on a fixture",
  },
  {
    key: "spot-welding",
    label: "Spot Welding",
    number: "03",
    body: "Water-cooled pedestal spot welders fix brackets and tabs to pipe and sheet metal parts, each station set up for the part it runs.",
    cover: "/images/facility/floor/enhanced/welding-and-spot-welding-shop.jpg",
    coverAlt: "Welding shop with MIG welding benches and a row of pedestal spot welding machines",
  },
];

/** Filters for the /facility photo grid: the three areas plus supporting shops. */
export const floorCategories: PhotoCategory[] = [
  ...floorAreas,
  { key: "pipe-bending", label: "Pipe Bending" },
  { key: "assembly", label: "Assembly" },
  { key: "finishing", label: "Finishing" },
  { key: "inspection", label: "Inspection" },
  { key: "storage", label: "Storage" },
];

const floorPhoto = (file: string, category: string, caption: string, alt: string): GalleryPhoto => ({
  src: `/images/facility/floor/${file}.jpg`,
  category,
  caption,
  alt,
});

export const floorPhotos: GalleryPhoto[] = [
  floorPhoto("mig-welding-sparks", "mig-welding", "Welding a Pipe Assembly", "Sparks flying as a welder MIG welds a pipe assembly held in a fixture"),
  floorPhoto("spot-welding-sparks", "spot-welding", "Spot Welding a Bracket", "Gloved operator spot welding a bracket between the electrodes of a pedestal welder"),
  floorPhoto("mig-welding-fixture", "mig-welding", "Pipe Assembly on the Fixture", "Welder in a cap and safety glasses welding a pipe assembly on a fixture"),
  floorPhoto("welding-bay", "mig-welding", "Welding Bay", "Two welders at their stations beneath a Safety Comes First poster, with bins of formed pipe parts in front"),
  floorPhoto("press-line-operators", "press-shop", "Operators at the Presses", "Three operators working side by side at a row of power presses"),
  floorPhoto("mig-welding-arc", "mig-welding", "Under the Arc", "Welder behind a hand shield lit by the welding arc"),
  floorPhoto("spot-welding-bracket", "spot-welding", "Spot Welder, Machine No. 2", "Operator positioning a sheet metal bracket in a pedestal spot welder"),
  floorPhoto("welding-and-spot-welding-shop", "spot-welding", "Welding and Spot Welding Shop", "Wide view of the welding shop with MIG welding benches and a row of spot welding machines"),
  floorPhoto("mig-welding-closeup", "mig-welding", "Welding at the Fixture", "Welder holding a hand shield while welding a pipe assembly on a fixture"),
  floorPhoto("press-shop-hall", "press-shop", "The Press Shop", "Wide view of the press shop hall with rows of presses, operators and stacks of sheet metal blanks"),
  floorPhoto("jack-assembly", "assembly", "Assembling a Scissor Jack", "Worker assembling a zinc-plated scissor jack at a bench stacked with jack components"),
  floorPhoto("press-blank-loading", "press-shop", "Loading a Blank", "Operator positioning a sheet metal blank in the die of a double-crank press"),
  floorPhoto("parts-racks", "storage", "Parts Racks", "Racks and bins of bagged, finished parts in the storage hall"),
  floorPhoto("press-operator-controls", "press-shop", "Operator at the Press", "Press operator at the controls of a mechanical press fitted with a progressive die"),
  floorPhoto("press-row", "press-shop", "Row of Presses", "Operators working at a row of mechanical presses of different tonnages"),
  floorPhoto("pipe-end-forming", "press-shop", "Forming Pipe Ends", "Operator forming the ends of steel tubes on a power press, with finished tubes stacked on the table"),
  floorPhoto("storage-area", "storage", "Storage Area", "Entrance to the storage area with steel bins and part trolleys"),
  floorPhoto("straight-side-press", "press-shop", "Straight-Side Press", "Operator working inside the bed of a large straight-side press"),
  floorPhoto("warehouse-bay", "storage", "Warehouse Bay", "Warehouse bay with stacked SAPL part bins, wire cages of formed parts and a delivery truck"),
  floorPhoto("komatsu-press", "press-shop", "Komatsu 200 Press", "Komatsu straight-side press with a die set in the bed and die racks alongside"),
  floorPhoto("surface-activation-tank", "finishing", "Surface Activation Tank", "Motor-driven perforated barrel sitting in a surface activation tank"),
  floorPhoto("bent-rod-parts-bin", "storage", "Bent Rod Parts", "Steel bin filled with bent rod parts with flattened, pierced ends"),
  floorPhoto("chin-fong-press", "press-shop", "Chin Fong Press No. 42", "Chin Fong straight-side press, machine number 42, with a die set in the bed"),
  floorPhoto("primed-steel-frames", "finishing", "Primed Steel Frames", "Rows of welded steel frames finished in red primer on the shop floor"),
  floorPhoto("straight-side-press-front", "press-shop", "Straight-Side Press, Front View", "Cowlishaw Walker straight-side press flanked by bins of formed parts"),
  floorPhoto("storage-hall-bins", "storage", "Storage Hall", "Storage hall with colour-coded steel bins in front of parts racks"),
  floorPhoto("heavy-press", "press-shop", "Heavy Press", "Large straight-side press with its bolster exposed, cordoned off with safety tape"),
  floorPhoto("surface-activation-line", "finishing", "Barrel Tanks", "Two barrel tanks against the wall under caustic hazard and surface activation signs"),
  floorPhoto("checking-fixture", "inspection", "Checking Fixture", "Inspector clamping a stamped sheet metal panel into a checking fixture"),
  floorPhoto("pipe-bender-loading", "pipe-bending", "Loading the Bender", "Operator placing a steel tube into a hydraulic pipe bending machine"),
  floorPhoto("toggle-clamp", "inspection", "Toggle Clamp", "Close-up of a red-handled toggle clamp on a checking fixture"),
  floorPhoto("mandrel-bender", "pipe-bending", "Feeding a Tube", "Operator feeding a straight steel tube into a pipe bending machine"),
  floorPhoto("checking-fixture-closeup", "inspection", "Seating the Panel", "Gloved inspector seating a panel against the locators of a checking fixture"),
  floorPhoto("pipe-bender-operator", "pipe-bending", "Pipe Bender Operator", "Operator at a hydraulic pipe bender beside a rack of straight tubes"),
  floorPhoto("panel-gauging", "inspection", "Gap Check", "Inspector in a Shaheen Automotive cap checking a clamped panel with a gauge"),
  floorPhoto("pipe-bender-setup", "pipe-bending", "Two Operators at the Bender", "Two operators working together at a hydraulic pipe bending machine"),
  floorPhoto("tube-bending", "pipe-bending", "Bending a Tube", "Operator bending a tube on a hydraulic bender, with bundles of tube stock in the foreground"),
  floorPhoto("pipe-bending-cell", "pipe-bending", "Pipe Bending Cell", "One operator unloading a bent tube while another pulls stock from a stack of steel tubes"),
];
