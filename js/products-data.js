/* ============================================================================
   AKSA METALS — PRODUCT DATA
   ============================================================================

   All twelve products live here, in one place. This single file feeds:
     1. the product grid on products.html
     2. all 12 individual product pages
     3. the specifications page tables
     4. the assistant's answers about sizes and grades

   Change a number here and it updates in all four places at once.

   The dimension ranges below are TYPICAL for an Indian copper & brass rolling
   mill. Replace them with what your Bidar plant actually produces before the
   site goes live — buyers will place orders against these figures.
   ============================================================================ */

const AKSA_PRODUCTS = [
  /* ------------------------------- COPPER -------------------------------- */
  {
    slug: "copper-circle",
    name: "Copper Circles",
    metal: "copper",
    family: "Circle",
    calcShape: "circle",
    image: "assets/img/product-copper-circle.jpg",
    tagline: "Deep-draw quality discs for utensils and pressed components.",
    intro:
      "Copper circles are round blanks cut from rolled copper sheet, made to be pressed, spun or deep-drawn into a finished shape. Ours are annealed to a soft, even temper so they draw without tearing at the rim, and the edges are trimmed clean so they feed smoothly into an automatic press.",
    highlights: [
      "Bright annealed, burr-free edges",
      "Consistent grain for deep drawing",
      "Cut to any diameter within range",
    ],
    grades: ["C11000 (ETP)", "C10200 (OF)", "C12200 (DHP)"],
    tempers: ["Soft / Annealed (O60)", "Half Hard (H02)"],
    specs: [
      { label: "Diameter", value: "40 mm - 1000 mm" },
      { label: "Thickness", value: "0.40 mm - 6.00 mm" },
      { label: "Purity", value: "99.90% min" },
      { label: "Thickness tolerance", value: "± 0.02 mm - ± 0.05 mm" },
      { label: "Diameter tolerance", value: "± 0.50 mm" },
      { label: "Surface", value: "Bright annealed / Mill finish" },
    ],
    standards: ["IS 410", "ASTM B152", "BS EN 1652"],
    applications: [
      "Cookware and utensil bases",
      "Deep-drawn pressed components",
      "Spun copper vessels",
      "Electrical contacts and washers",
      "Handicraft and artware blanks",
    ],
  },
  {
    slug: "copper-coil",
    name: "Copper Coils",
    metal: "copper",
    family: "Coil",
    calcShape: "strip",
    image: "assets/img/product-copper-coil.jpg",
    tagline: "Continuous rolled copper for high-volume stamping lines.",
    intro:
      "Supplied as continuous cold-rolled coil, wound tight and edge-aligned so it feeds a press without wandering. Gauge is held across the full length of the coil, which is what keeps a progressive die running instead of stopping every few hundred strokes for adjustment.",
    highlights: [
      "Gauge held across the full coil length",
      "Tight, edge-aligned winding",
      "Standard 300/400/500 mm inner diameter",
    ],
    grades: ["C11000 (ETP)", "C10200 (OF)", "C12200 (DHP)"],
    tempers: ["Soft / Annealed", "Quarter Hard", "Half Hard", "Full Hard"],
    specs: [
      { label: "Thickness", value: "0.10 mm - 3.00 mm" },
      { label: "Width", value: "10 mm - 600 mm" },
      { label: "Inner diameter", value: "300 / 400 / 500 mm" },
      { label: "Coil weight", value: "50 kg - 500 kg" },
      { label: "Purity", value: "99.90% min" },
      { label: "Thickness tolerance", value: "± 0.01 mm - ± 0.03 mm" },
    ],
    standards: ["IS 1897", "ASTM B152", "BS EN 1652"],
    applications: [
      "Progressive-die stamping",
      "Transformer and motor windings",
      "Roofing and cladding rolls",
      "Cable and conductor manufacture",
      "Heat exchanger fins",
    ],
  },
  {
    slug: "copper-sheet",
    name: "Copper Sheets",
    metal: "copper",
    family: "Sheet",
    calcShape: "sheet",
    image: "assets/img/product-copper-sheet.jpg",
    tagline: "Flat, level copper sheet cut to the size you actually need.",
    intro:
      "Cold-rolled and levelled so the sheet lies flat on the table rather than rocking on a bow. We cut to your length instead of forcing you to buy a standard size and scrap the remainder, which matters when copper is priced by the kilogram.",
    highlights: [
      "Levelled flat - no bow or wave",
      "Cut to your exact length",
      "Protective interleaving on request",
    ],
    grades: ["C11000 (ETP)", "C10200 (OF)", "C12200 (DHP)"],
    tempers: ["Soft / Annealed", "Half Hard", "Full Hard"],
    specs: [
      { label: "Thickness", value: "0.30 mm - 6.00 mm" },
      { label: "Width", value: "Up to 1000 mm" },
      { label: "Length", value: "Up to 3000 mm (cut to order)" },
      { label: "Purity", value: "99.90% min" },
      { label: "Thickness tolerance", value: "± 0.02 mm - ± 0.05 mm" },
      { label: "Flatness", value: "Levelled" },
    ],
    standards: ["IS 4413", "ASTM B152", "BS EN 1652"],
    applications: [
      "Electrical panels and busbar backing",
      "Roofing, flashing and cladding",
      "Nameplates and signage",
      "Chemical and process equipment",
      "Architectural and decorative panels",
    ],
  },
  {
    slug: "copper-strip",
    name: "Copper Strips",
    metal: "copper",
    family: "Strip",
    calcShape: "strip",
    image: "assets/img/product-copper-strip.jpg",
    tagline: "Precision-slit widths with clean, burr-free edges.",
    intro:
      "Slit from wide coil to the exact width you specify. Edge condition is where most strip disappoints - a burr jams a feeder and a wavy edge scraps the part - so ours are slit with sharp tooling and checked along the run rather than only at the start.",
    highlights: [
      "Slit to ± 0.05 mm on width",
      "Burr-free, deburred or round edge",
      "Supplied in coil or cut lengths",
    ],
    grades: ["C11000 (ETP)", "C10200 (OF)", "C12200 (DHP)"],
    tempers: ["Soft / Annealed", "Quarter Hard", "Half Hard", "Full Hard", "Spring Hard"],
    specs: [
      { label: "Thickness", value: "0.10 mm - 3.00 mm" },
      { label: "Width", value: "5 mm - 300 mm" },
      { label: "Width tolerance", value: "± 0.05 mm" },
      { label: "Edge", value: "Slit / Deburred / Round" },
      { label: "Purity", value: "99.90% min" },
      { label: "Thickness tolerance", value: "± 0.01 mm - ± 0.03 mm" },
    ],
    standards: ["IS 1897", "ASTM B152", "BS EN 1652"],
    applications: [
      "Electrical terminals and lugs",
      "Switchgear contacts",
      "Earthing and lightning-protection tape",
      "Transformer strip windings",
      "Gaskets and shielding",
    ],
  },
  {
    slug: "copper-plate",
    name: "Copper Plates",
    metal: "copper",
    family: "Plate",
    calcShape: "sheet",
    image: "assets/img/product-copper-plate.jpg",
    tagline: "Heavy-gauge copper for busbars and thermal duty.",
    intro:
      "Anything above roughly 6 mm is plate rather than sheet, and it is bought for conductivity and heat capacity rather than for forming. Supplied saw-cut or sheared to size, with mill test certification covering conductivity as well as composition.",
    highlights: [
      "High electrical conductivity",
      "Saw-cut or sheared to size",
      "Machining allowance on request",
    ],
    grades: ["C11000 (ETP)", "C10200 (OF)"],
    tempers: ["Soft / Annealed", "Half Hard"],
    specs: [
      { label: "Thickness", value: "6.00 mm - 50.00 mm" },
      { label: "Width", value: "Up to 1000 mm" },
      { label: "Length", value: "Up to 3000 mm (cut to order)" },
      { label: "Conductivity", value: "≥ 100% IACS (C11000)" },
      { label: "Purity", value: "99.90% min" },
      { label: "Thickness tolerance", value: "± 0.10 mm - ± 0.30 mm" },
    ],
    standards: ["IS 4413", "ASTM B152"],
    applications: [
      "Busbars and electrical distribution",
      "Earthing plates",
      "Welding and electrode backing",
      "Heat sinks and thermal blocks",
      "Machined industrial components",
    ],
  },
  {
    slug: "copper-foil",
    name: "Copper Foils",
    metal: "copper",
    family: "Foil",
    calcShape: "strip",
    image: "assets/img/product-copper-foil.jpg",
    tagline: "Ultra-thin rolled copper down to 18 microns.",
    intro:
      "Rolled down to foil gauge for shielding, laminating and battery work. At this thickness, pinholes and gauge drift are the failure modes that matter, so foil is inspected across the rewind rather than only at the ends of the run.",
    highlights: [
      "Down to 0.018 mm (18 micron)",
      "Pinhole-checked on rewind",
      "Wound on 76 mm paper core",
    ],
    grades: ["C11000 (ETP)", "C10200 (OF)"],
    tempers: ["Soft / Annealed", "Hard Rolled"],
    specs: [
      { label: "Thickness", value: "0.018 mm - 0.10 mm" },
      { label: "Width", value: "Up to 600 mm" },
      { label: "Core", value: "76 mm paper core" },
      { label: "Purity", value: "99.90% min" },
      { label: "Thickness tolerance", value: "± 0.002 mm - ± 0.005 mm" },
      { label: "Surface", value: "Bright / Matte" },
    ],
    standards: ["ASTM B152", "IS 1897"],
    applications: [
      "EMI and RF shielding",
      "Flexible printed circuits",
      "Battery current collectors",
      "Transformer interleaving",
      "Craft, embossing and laminating",
    ],
  },

  /* -------------------------------- BRASS -------------------------------- */
  {
    slug: "brass-circle",
    name: "Brass Circles",
    metal: "brass",
    family: "Circle",
    calcShape: "circle",
    image: "assets/img/product-brass-circle.jpg",
    tagline: "Cartridge and yellow brass blanks for spinning and pressing.",
    intro:
      "Brass circles in 70/30 cartridge brass for deep draws and 63/37 yellow brass for general pressing. The alloy choice decides how far the metal will move before it splits - tell us the depth of draw and we will recommend the grade rather than leaving you to guess.",
    highlights: [
      "70/30 for deep draws, 63/37 for general work",
      "Bright annealed, ready to press",
      "Any diameter within range",
    ],
    grades: ["CuZn30 / C26000 (70/30)", "CuZn37 / C27200 (63/37)", "Lead-free brass"],
    tempers: ["Soft / Annealed", "Half Hard"],
    specs: [
      { label: "Diameter", value: "40 mm - 800 mm" },
      { label: "Thickness", value: "0.40 mm - 5.00 mm" },
      { label: "Composition", value: "Cu 63-70% / Zn balance" },
      { label: "Thickness tolerance", value: "± 0.02 mm - ± 0.05 mm" },
      { label: "Diameter tolerance", value: "± 0.50 mm" },
      { label: "Surface", value: "Bright annealed / Mill finish" },
    ],
    standards: ["IS 1972", "IS 410", "ASTM B36", "BS EN 1652"],
    applications: [
      "Utensils, thali and cookware",
      "Lamp and lighting bodies",
      "Deep-drawn pressed parts",
      "Temple and handicraft articles",
      "Musical instrument components",
    ],
  },
  {
    slug: "brass-coil",
    name: "Brass Coils",
    metal: "brass",
    family: "Coil",
    calcShape: "strip",
    image: "assets/img/product-brass-coil.jpg",
    tagline: "Even-temper brass coil that runs a die without surprises.",
    intro:
      "Cold-rolled brass in continuous coil, annealed to a uniform temper end to end. Temper variation within a single coil is what causes springback to drift mid-run, so ours is controlled on a set batch cycle rather than by feel.",
    highlights: [
      "Uniform temper end to end",
      "Predictable springback",
      "Standard 300/400/500 mm inner diameter",
    ],
    grades: ["CuZn30 / C26000", "CuZn37 / C27200", "CuZn40 / C28000", "Lead-free brass"],
    tempers: ["Soft / Annealed", "Quarter Hard", "Half Hard", "Full Hard"],
    specs: [
      { label: "Thickness", value: "0.10 mm - 3.00 mm" },
      { label: "Width", value: "10 mm - 600 mm" },
      { label: "Inner diameter", value: "300 / 400 / 500 mm" },
      { label: "Coil weight", value: "50 kg - 500 kg" },
      { label: "Composition", value: "Cu 60-70% / Zn balance" },
      { label: "Thickness tolerance", value: "± 0.01 mm - ± 0.03 mm" },
    ],
    standards: ["IS 410", "ASTM B36", "BS EN 1652"],
    applications: [
      "High-speed stamping",
      "Zip, buckle and fastener manufacture",
      "Electrical accessory pressings",
      "Decorative trim and moulding",
      "Radiator and heat-exchange parts",
    ],
  },
  {
    slug: "brass-sheet",
    name: "Brass Sheets",
    metal: "brass",
    family: "Sheet",
    calcShape: "sheet",
    image: "assets/img/product-brass-sheet.jpg",
    tagline: "Flat brass sheet with an even, consistent colour.",
    intro:
      "Levelled brass sheet in a range of alloys, including lead-free grades for drinking-water and food-contact work. Colour consistency matters more than most buyers expect - mismatched sheets in one visible assembly become obvious the moment they are polished.",
    highlights: [
      "Even colour across the batch",
      "Lead-free grades available",
      "Cut to your exact length",
    ],
    grades: ["CuZn30 / C26000", "CuZn37 / C27200", "CuZn40 / C28000", "Lead-free brass"],
    tempers: ["Soft / Annealed", "Half Hard", "Full Hard"],
    specs: [
      { label: "Thickness", value: "0.30 mm - 5.00 mm" },
      { label: "Width", value: "Up to 1000 mm" },
      { label: "Length", value: "Up to 3000 mm (cut to order)" },
      { label: "Composition", value: "Cu 60-70% / Zn balance" },
      { label: "Thickness tolerance", value: "± 0.02 mm - ± 0.05 mm" },
      { label: "Flatness", value: "Levelled" },
    ],
    standards: ["IS 410", "ASTM B36", "BS EN 1652"],
    applications: [
      "Architectural and interior panels",
      "Nameplates, plaques and signage",
      "Musical instrument sheet",
      "Hardware and fittings",
      "Engraving and etching blanks",
    ],
  },
  {
    slug: "brass-strip",
    name: "Brass Strips",
    metal: "brass",
    family: "Strip",
    calcShape: "strip",
    image: "assets/img/product-brass-strip.jpg",
    tagline: "Narrow-slit brass with a controlled spring temper.",
    intro:
      "Slit brass strip for contacts, clips and springs, where the temper does the work. Specify the hardness you need and we will roll to it; if you are not sure, send the part drawing and we will suggest a temper that holds its shape in service.",
    highlights: [
      "Spring tempers available",
      "Slit to ± 0.05 mm on width",
      "Coil or cut lengths",
    ],
    grades: ["CuZn30 / C26000", "CuZn37 / C27200", "Leaded brass", "Lead-free brass"],
    tempers: ["Soft / Annealed", "Quarter Hard", "Half Hard", "Full Hard", "Spring Hard"],
    specs: [
      { label: "Thickness", value: "0.10 mm - 2.50 mm" },
      { label: "Width", value: "5 mm - 300 mm" },
      { label: "Width tolerance", value: "± 0.05 mm" },
      { label: "Edge", value: "Slit / Deburred / Round" },
      { label: "Composition", value: "Cu 60-70% / Zn balance" },
      { label: "Thickness tolerance", value: "± 0.01 mm - ± 0.03 mm" },
    ],
    standards: ["IS 410", "ASTM B36", "BS EN 1652"],
    applications: [
      "Electrical contacts and clips",
      "Springs and spring washers",
      "Zips, buckles and eyelets",
      "Watch and instrument parts",
      "Decorative banding and inlay",
    ],
  },
  {
    slug: "brass-plate",
    name: "Brass Plates",
    metal: "brass",
    family: "Plate",
    calcShape: "sheet",
    image: "assets/img/product-brass-plate.jpg",
    tagline: "Heavy brass sections, including naval grade.",
    intro:
      "Thick brass for machining, marine fittings and wear-facing duty. Naval brass carries a small tin addition that resists dezincification in salt water, which ordinary yellow brass will not survive for long.",
    highlights: [
      "Naval brass for marine service",
      "Machining allowance on request",
      "Saw-cut or sheared to size",
    ],
    grades: ["CuZn37 / C27200", "CuZn40 / C28000 (Muntz)", "C46400 (Naval Brass)", "Leaded brass"],
    tempers: ["Soft / Annealed", "Half Hard", "As Rolled"],
    specs: [
      { label: "Thickness", value: "5.00 mm - 40.00 mm" },
      { label: "Width", value: "Up to 1000 mm" },
      { label: "Length", value: "Up to 3000 mm (cut to order)" },
      { label: "Composition", value: "Cu 59-63% / Zn balance / Sn 0.5-1.0% (naval)" },
      { label: "Thickness tolerance", value: "± 0.10 mm - ± 0.30 mm" },
      { label: "Surface", value: "Mill finish / Machined" },
    ],
    standards: ["IS 410", "ASTM B36", "ASTM B171 (naval)"],
    applications: [
      "Marine and naval fittings",
      "Machined valve and pump bodies",
      "Bearing and wear plates",
      "Heavy hardware and locks",
      "Tool and jig components",
    ],
  },
  {
    slug: "brass-foil",
    name: "Brass Foils",
    metal: "brass",
    family: "Foil",
    calcShape: "strip",
    image: "assets/img/product-brass-foil.jpg",
    tagline: "Fine-gauge brass foil with a clean, bright surface.",
    intro:
      "Brass rolled to foil gauge for shims, gaskets, decorative laminating and craft work. Shim stock in particular is bought on thickness accuracy alone, so foil is measured continuously through the mill rather than sampled at the ends.",
    highlights: [
      "Down to 0.02 mm",
      "Continuously gauge-measured",
      "Bright or matte surface",
    ],
    grades: ["CuZn30 / C26000", "CuZn37 / C27200"],
    tempers: ["Soft / Annealed", "Hard Rolled"],
    specs: [
      { label: "Thickness", value: "0.02 mm - 0.10 mm" },
      { label: "Width", value: "Up to 600 mm" },
      { label: "Core", value: "76 mm paper core" },
      { label: "Composition", value: "Cu 63-70% / Zn balance" },
      { label: "Thickness tolerance", value: "± 0.002 mm - ± 0.005 mm" },
      { label: "Surface", value: "Bright / Matte" },
    ],
    standards: ["ASTM B36", "IS 410"],
    applications: [
      "Shim stock and spacers",
      "Gaskets and seals",
      "Decorative laminating",
      "Embossing and craft foil",
      "Instrument diaphragms",
    ],
  },
];

/* Convenience lookups used by the pages and the assistant. */
function productBySlug(slug) {
  return AKSA_PRODUCTS.find(function (p) { return p.slug === slug; }) || null;
}
function productsByMetal(metal) {
  return AKSA_PRODUCTS.filter(function (p) { return p.metal === metal; });
}
function specValue(product, label) {
  var hit = product.specs.find(function (s) { return s.label === label; });
  return hit ? hit.value : null;
}

/* Make the data available to the page generator when run under Node. */
if (typeof module !== "undefined" && module.exports) {
  module.exports = { AKSA_PRODUCTS: AKSA_PRODUCTS };
}
