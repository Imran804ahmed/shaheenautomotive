const floorPhoto = (name: string) => `/images/facility/floor/${name}.jpg`;

/** The three quality gates, laid out like the plant areas on /facility. */
export const qualityStages = [
  {
    key: "ots-inspection",
    number: "01",
    label: "OTS sample inspection",
    body: "Once tooling is complete, an off-tool sample is produced and inspected jointly by the SAPL quality team and the customer's quality department before the part is approved.",
    cover: floorPhoto("checking-fixture-closeup"),
    coverAlt: "Inspector checking a stamped part on a clamped checking fixture",
    facts: [
      { name: "Stage", value: "Tooling sign-off" },
      { name: "Inspected by", value: "SAPL + customer QA" },
    ],
  },
  {
    key: "line-verification",
    number: "02",
    label: "Trial production & line verification",
    body: "A line verification process is run in the presence of the customer's team, confirming the production line is ready for volume before mass production begins.",
    cover: floorPhoto("press-line-safety-gear"),
    coverAlt: "Operators in hard hats, safety glasses and high-visibility vests running a line of mechanical power presses",
    facts: [
      { name: "Stage", value: "Pre-volume" },
      { name: "Witnessed by", value: "Customer team on-site" },
    ],
  },
  {
    key: "production-qa",
    number: "03",
    label: "Production quality assurance",
    body: "Once in mass production, parts are checked on gauging fixtures through the run and delivered against schedule with consistent quality.",
    cover: floorPhoto("panel-gauging"),
    coverAlt: "Inspector clamping a sheet metal part into a gauging fixture",
    facts: [
      { name: "Stage", value: "Mass production" },
      { name: "Delivery", value: "Against schedule" },
    ],
  },
];
