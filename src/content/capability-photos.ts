// a shop-floor photo for each capability card
export const capabilityPhotos: Record<string, { src: string; alt: string; position?: string }> = {
  "press-shop": {
    src: "/images/facility/floor/press-line-safety-gear.jpg",
    alt: "Operators in hard hats, safety glasses and high-visibility vests running a line of mechanical power presses",
  },
  inspection: {
    src: "/images/facility/floor/faro-arm-inspection.jpg",
    alt: "Inspector in a Shaheen Automotive shirt measuring a checking fixture with a FARO Platinum Arm probe",
    position: "50% 64%",
  },
  "pipe-shop": {
    src: "/images/facility/floor/cnc-pipe-bender-operator.jpg",
    alt: "Operator in a green cap and gloves loading a steel tube into a CNC pipe bending machine",
    position: "50% 40%",
  },
  welding: {
    src: "/images/facility/floor/mig-welding-pipe-assembly.jpg",
    alt: "Welder in a hi-vis vest and welding helmet MIG welding a pipe assembly on a bench fixture, sparks flying",
    position: "50% 31%",
  },
  "design-tooling": {
    src: "/images/facility/floor/checking-fixture.jpg",
    alt: "Inspector clamping a stamped sheet metal panel into a checking fixture",
  },
  "surface-finishing": {
    src: "/images/facility/floor/surface-activation-tank-front-v2.jpg",
    alt: "Motor-driven perforated barrels in a Shaheen surface activation tank, with racks of pipe parts in the foreground",
    position: "50% 32%",
  },
};
