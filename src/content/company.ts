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
  image?: string;
  imageCaption?: string;
};

// Awards named explicitly in the "Certifications & Awards" slide text.
export const namedAwards: Award[] = [
  { title: "Overall Performance Award", awardedBy: "Toyota Indus Motor Company", year: "2014" },
  { title: "Best Quality Performance Award", awardedBy: "Hino Pak Motors", year: "2012" },
  { title: "Timely Development Award", awardedBy: "Toyota Indus Motor Company", year: "2024" },
  { title: "Zero Delay in Delivery Award", awardedBy: "Toyota Indus Motor Company", year: "2012" },
  { title: "Special Effort in Development Award", awardedBy: "Pak Suzuki Motor Co. Ltd.", year: "2012-2014" },
];

// Physical award / trophy photographs from the profile. Captions describe
// only what is legible in each photograph; they are shown as a photo record
// of recognition received, independent of the exact bullet list above.
export const awardPhotos: Award[] = [
  {
    title: "Delivery Award",
    awardedBy: "Indus Motor Company Ltd., Suppliers Convention",
    year: "2008",
    image: "/images/awards/indus-motor-delivery-2008.jpeg",
  },
  {
    title: "Overall Performance Award",
    awardedBy: "Indus Motor Company, Suppliers Convention",
    year: "2014",
    image: "/images/awards/indus-motor-overall-performance-2014.jpeg",
  },
  {
    title: "Vendor Special Award",
    awardedBy: "Pak Suzuki Motor Co. Ltd., for special efforts in development",
    year: "1998-2000",
    image: "/images/awards/pak-suzuki-vendor-special-1998-2000.jpeg",
  },
  {
    title: "Timely Development Award",
    awardedBy: "Toyota Indus Motor Company, Suppliers Conference",
    year: "2024",
    image: "/images/awards/toyota-timely-development-2024.png",
  },
  {
    title: "Vendor Performance Award",
    awardedBy: "Kia / Hyundai (Dewan Motors), presented to Shaheen Engineering Works",
    year: "Date partially legible in source photograph",
    image: "/images/awards/kia-vendor-performance.jpeg",
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
  note?: string;
};

export const capabilities: Capability[] = [
  {
    slug: "design-tooling",
    title: "Jigs, Fixtures & Tooling Design",
    body: "In-house jig and tool design capability, from simple jigs to more complex fixtures, built to suit each customer's product and process requirements.",
  },
  {
    slug: "press-shop",
    title: "Sheet Metal Stamping",
    body: "A sheet metal parts process facility manufacturing automotive components to production quality, across a mechanical, hydraulic and pneumatic press fleet.",
  },
  {
    slug: "pipe-shop",
    title: "Pipe Bending & Flaring",
    body: "Skilled labor and automated NC / CNC pipe bending equipment producing formed pipe parts with high efficiency across a wide diameter range.",
  },
  {
    slug: "welding",
    title: "Welding & Assembly",
    body: "A range of welding processes, including machine welding, applied in production to suit the standards and practices required by each customer.",
  },
  {
    slug: "surface-finishing",
    title: "Galvanizing & Powder Coating",
    body: "A hot-dip galvanizing process and powder coating capability operated under quality control to ASTM standards.",
    note: "Current operating status of this facility should be reconfirmed before publishing without qualification.",
  },
  {
    slug: "inspection",
    title: "Dimensional Inspection",
    body: "FARO measurement solutions for manual and automated inspection of individual parts, sub-components and final assemblies.",
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
  photos: ProductPhoto[];
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
    photos: [
      { src: "/images/products/toyota/toyota-component-4-hinges.jpeg", alt: "Sheet metal hinge component manufactured for a Toyota Indus Motor programme" },
      { src: "/images/products/toyota/toyota-component-6.jpeg", alt: "Formed pipe / bent rod component manufactured for a Toyota Indus Motor programme" },
      { src: "/images/products/toyota/toyota-component-1.jpeg", alt: "Stamped sheet metal bracket manufactured for a Toyota Indus Motor programme" },
      { src: "/images/products/toyota/toyota-component-2.jpeg", alt: "Formed sheet metal rail component manufactured for a Toyota Indus Motor programme" },
      { src: "/images/products/toyota/toyota-component-3.jpeg", alt: "Stamped sheet metal shield component manufactured for a Toyota Indus Motor programme" },
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
    photos: [
      { src: "/images/products/suzuki/suzuki-component-3-jack.jpeg", alt: "Jack assembly component manufactured for a Pak Suzuki programme" },
      { src: "/images/products/suzuki/suzuki-component-5-pipe.jpeg", alt: "Formed pipe component manufactured for a Pak Suzuki programme" },
      { src: "/images/products/suzuki/suzuki-component-1.jpeg", alt: "Stamped sheet metal mounting plate manufactured for a Pak Suzuki programme" },
      { src: "/images/products/suzuki/suzuki-component-2.jpeg", alt: "Formed bracket with lever component manufactured for a Pak Suzuki programme" },
      { src: "/images/products/suzuki/suzuki-component-4.jpeg", alt: "Bent rod bracket component manufactured for a Pak Suzuki programme" },
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
    photos: [
      { src: "/images/products/yamaha/yamaha-component-1-lever.png", alt: "Bent rod stand lever component manufactured for a Yamaha motorcycle programme" },
      { src: "/images/products/yamaha/yamaha-component-2-stand.jpeg", alt: "Bent rod main-stand component manufactured for a Yamaha motorcycle programme" },
      { src: "/images/products/yamaha/yamaha-component-3-brackets.jpeg", alt: "Assorted stamped and welded bracket components manufactured for a Yamaha motorcycle programme" },
    ],
    hasVerifiedExamples: true,
  },
];

export type ProductCategory = {
  slug: "sheet-metal-parts" | "formed-pipe-parts" | "bent-rod-parts";
  title: string;
  shortTitle: string;
  summary: string;
  processTags: string[];
};

export const productCategories: ProductCategory[] = [
  {
    slug: "sheet-metal-parts",
    title: "Sheet Metal Parts",
    shortTitle: "Sheet Metal",
    summary:
      "Stamped and formed sheet metal components, produced across a mechanical, hydraulic and pneumatic press fleet ranging from 15 to 300 tons, for automotive and home appliance OEMs.",
    processTags: ["Stamping", "Progressive & line dies", "Welded assemblies", "Dimensional inspection"],
  },
  {
    slug: "formed-pipe-parts",
    title: "Formed Pipe Parts",
    shortTitle: "Formed Pipe",
    summary:
      "NC and CNC pipe bending and hydraulic pipe flaring, producing formed pipe components across a ø10-ø38 mm diameter range for automotive applications.",
    processTags: ["NC / CNC bending", "Pipe flaring", "Welding & assembly", "Dimensional inspection"],
  },
  {
    slug: "bent-rod-parts",
    title: "Bent Rod Parts",
    shortTitle: "Bent Rod",
    summary:
      "Bent rod components and assemblies, including stands, brackets and structural rod parts, primarily supplied to motorcycle OEM programmes.",
    processTags: ["Rod bending", "Bracket welding", "Surface finishing", "Dimensional inspection"],
  },
];

// Photo galleries per product category. Photographs are grouped by the
// manufacturing form visible in the image itself (a stamped flat panel vs.
// a bent tube vs. a bent solid rod), not by matching to a specific named
// part, since the source deck does not pair individual photos with individual
// part names.
export const categoryPhotos: Record<ProductCategory["slug"], ProductPhoto[]> = {
  "sheet-metal-parts": [
    { src: "/images/products/toyota/toyota-component-1.jpeg", alt: "Stamped sheet metal shield component, Toyota programme" },
    { src: "/images/products/toyota/toyota-component-2.jpeg", alt: "Formed sheet metal rail component, Toyota programme" },
    { src: "/images/products/toyota/toyota-component-3.jpeg", alt: "Stamped sheet metal shield component, Toyota programme" },
    { src: "/images/products/toyota/toyota-component-4-hinges.jpeg", alt: "Stamped sheet metal hinge components, Toyota programme" },
    { src: "/images/products/suzuki/suzuki-component-1.jpeg", alt: "Stamped sheet metal mounting plate, Pak Suzuki programme" },
    { src: "/images/products/yamaha/yamaha-component-3-brackets.jpeg", alt: "Stamped and welded bracket components, Yamaha programme" },
  ],
  "formed-pipe-parts": [
    { src: "/images/products/toyota/toyota-component-6.jpeg", alt: "Formed pipe / bent rod component, Toyota programme" },
    { src: "/images/products/suzuki/suzuki-component-5-pipe.jpeg", alt: "Formed pipe water inlet component, Pak Suzuki programme" },
  ],
  "bent-rod-parts": [
    { src: "/images/products/yamaha/yamaha-component-1-lever.png", alt: "Bent rod stand lever component, Yamaha programme" },
    { src: "/images/products/yamaha/yamaha-component-2-stand.jpeg", alt: "Bent rod main-stand component, Yamaha programme" },
    { src: "/images/products/suzuki/suzuki-component-4.jpeg", alt: "Bent rod bracket component, Pak Suzuki programme" },
    { src: "/images/products/suzuki/suzuki-component-3-jack.jpeg", alt: "Bent rod jack assembly component, Pak Suzuki programme" },
    { src: "/images/products/suzuki/suzuki-component-2.jpeg", alt: "Formed rod bracket with lever, Pak Suzuki programme" },
  ],
};

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
    slug: "director",
    name: "Director Name",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here: the Director's role at Shaheen Automotive, their background, and what they focus on.",
    quote: undefined,
    photo: "/images/leadership/director.jpg",
    photoAlt: "Portrait of the Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-2",
    name: "Director Name 2",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-2.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-3",
    name: "Director Name 3",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-3.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-4",
    name: "Director Name 4",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-4.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-5",
    name: "Director Name 5",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-5.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-6",
    name: "Director Name 6",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-6.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-7",
    name: "Director Name 7",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-7.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-8",
    name: "Director Name 8",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-8.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-9",
    name: "Director Name 9",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-9.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
  {
    slug: "director-10",
    name: "Director Name 10",
    title: "Director",
    bio: "Add a 2-3 sentence introduction here.",
    quote: undefined,
    photo: "/images/leadership/director-10.jpg",
    photoAlt: "Portrait of a Director of Shaheen Automotive (Pvt.) Ltd.",
    isPlaceholder: true,
  },
];

export const brand = {
  logoFull: "/images/brand/sapl-logo-full.png",
  mark: "/images/brand/sapl-mark.png",
  logoFullLight: "/images/brand/sapl-logo-full-light.png",
  markLight: "/images/brand/sapl-mark-light.png",
};
