/* ============================================================================
   AKSA METALS — LOGIC TESTS
   ----------------------------------------------------------------------------
   Checks the two pieces of the site that can be silently wrong:

     1. the weight calculator's arithmetic, against values worked out by hand
     2. the assistant's question matching, against a script of real enquiries

   Neither needs a browser — the browser globals are stubbed below.

   Run:  node tools/test.js
   ============================================================================ */

const fs = require("fs");
const vm = require("vm");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const { AKSA_PRODUCTS } = require(path.join(ROOT, "js", "products-data.js"));

let passed = 0;
let failed = 0;

function check(label, actual, expected) {
  const ok = actual === expected;
  if (ok) { passed++; console.log(`  ok    ${label}`); }
  else    { failed++; console.log(`  FAIL  ${label}\n          expected: ${expected}\n          actual:   ${actual}`); }
}

function checkClose(label, actual, expected, tolerance) {
  const ok = Math.abs(actual - expected) <= tolerance;
  if (ok) { passed++; console.log(`  ok    ${label}  (${actual.toFixed(2)})`); }
  else    { failed++; console.log(`  FAIL  ${label}\n          expected: ${expected} ±${tolerance}\n          actual:   ${actual}`); }
}

/* ========================================================================== *
   Load a browser script into a sandbox and pull named values back out.
 * ========================================================================== */
function loadBrowserScript(file, exportNames, extraGlobals) {
  const src = fs.readFileSync(path.join(ROOT, file), "utf8");

  const sandbox = Object.assign(
    {
      console,
      Math,
      Date,
      JSON,
      URLSearchParams,
      isFinite,
      parseFloat,
      parseInt,
      String,
      Number,
      Array,
      Object,
      RegExp,
      encodeURIComponent,
      setTimeout,
      Promise,
      fetch: async () => { throw new Error("network disabled in tests"); },
      navigator: {},
      window: { location: { search: "" }, innerWidth: 1200 },
      document: {
        addEventListener() {},
        querySelectorAll: () => [],
        querySelector: () => null,
        getElementById: () => null,
        createElement: () => ({ style: {}, classList: { add() {}, remove() {} }, appendChild() {} }),
        body: { appendChild() {}, classList: { add() {}, remove() {}, contains: () => false } },
      },
    },
    extraGlobals || {}
  );
  sandbox.globalThis = sandbox;

  vm.createContext(sandbox);
  /* Top-level const/let are not attached to the context object, so the
     appended line lifts the ones we want into a plain object. */
  vm.runInContext(
    src + "\n;globalThis.__exports = { " + exportNames.join(", ") + " };",
    sandbox
  );
  return sandbox.__exports;
}

/* ========================================================================== *
   1 — WEIGHT CALCULATOR
 * ========================================================================== */
console.log("\nWEIGHT CALCULATOR — arithmetic");
console.log("──────────────────────────────────────────────────────────");

const calc = loadBrowserScript(
  "js/calculator.js",
  ["DENSITY", "SHAPES", "formatWeight"],
  { waLink: () => "" }
);

/* grams for one piece: volume(mm³) / 1000 * density */
function grams(shapeKey, dims, alloyKey) {
  const volume = calc.SHAPES[shapeKey].volume(dims);
  return (volume / 1000) * calc.DENSITY[alloyKey].d;
}

/* Values below were worked out by hand, independently of the code. */
checkClose(
  "Copper circle Ø300 × 0.8 mm  → 506.7 g",
  grams("circle", { dia: 300, thk: 0.8 }, "c11000"), 506.68, 0.1
);
checkClose(
  "Copper sheet 1000 × 500 × 1.2 mm  → 5376 g",
  grams("sheet", { len: 1000, wid: 500, thk: 1.2 }, "c11000"), 5376.0, 0.5
);
checkClose(
  "Copper strip 50 m × 40 × 0.5 mm  → 8960 g",
  grams("strip", { len: 50, wid: 40, thk: 0.5 }, "c11000"), 8960.0, 0.5
);
checkClose(
  "Copper rod Ø12 mm × 3 m  → 3040 g",
  grams("rod", { dia: 12, len: 3 }, "c11000"), 3040.06, 1
);
checkClose(
  "Copper tube Ø25 × 1.5 wall × 3 m  → 2976 g",
  grams("tube", { od: 25, wall: 1.5, len: 3 }, "c11000"), 2976.44, 1
);
checkClose(
  "Copper wire Ø2.5 mm × 500 m  → 21991 g",
  grams("wire", { dia: 2.5, len: 500 }, "c11000"), 21991.1, 2
);
checkClose(
  "Brass 70/30 circle Ø300 × 0.8 mm  → 482.4 g",
  grams("circle", { dia: 300, thk: 0.8 }, "cuzn30"), 482.36, 0.1
);

/* Tube guard: a wall thicker than the radius is not a tube. */
check(
  "Tube rejects wall ≥ half the outer diameter",
  calc.SHAPES.tube.validate({ od: 10, wall: 5, len: 1 }) !== null,
  true
);
check(
  "Tube accepts a sane wall",
  calc.SHAPES.tube.validate({ od: 25, wall: 1.5, len: 3 }),
  null
);

/* Unit switching */
console.log("\nWEIGHT CALCULATOR — unit formatting");
console.log("──────────────────────────────────────────────────────────");
check("0.5067 kg formats as grams",  calc.formatWeight(0.5067), "506.7 g");
check("5.376 kg formats as kg",      calc.formatWeight(5.376),  "5.38 kg");
check("1500 kg formats as tonnes",   calc.formatWeight(1500),   "1.500 t");
check("zero formats as a dash",      calc.formatWeight(0),      "—");

/* Every alloy density should be plausible for copper or brass. */
console.log("\nWEIGHT CALCULATOR — alloy table");
console.log("──────────────────────────────────────────────────────────");
let densitiesSane = true;
for (const [key, a] of Object.entries(calc.DENSITY)) {
  if (!(a.d > 8.3 && a.d < 9.0)) { densitiesSane = false; console.log(`        ${key} density ${a.d} out of range`); }
}
check("All 8 alloy densities are between 8.3 and 9.0 g/cm³", densitiesSane, true);
check("Alloy count", Object.keys(calc.DENSITY).length, 8);
check("Shape count", Object.keys(calc.SHAPES).length, 6);

/* ========================================================================== *
   2 — ASSISTANT
 * ========================================================================== */
console.log("\nASSISTANT — question matching");
console.log("──────────────────────────────────────────────────────────");

const CONFIG = require(path.join(ROOT, "js", "site-config.js")) || {};
/* site-config.js is a browser script too, so load it the same way. */
const cfg = loadBrowserScript("js/site-config.js", ["AKSA_CONFIG", "waLink", "telLink"]);

const bot = loadBrowserScript(
  "js/assistant.js",
  ["answer", "normalise", "detectProduct", "fallback", "INTENTS"],
  {
    AKSA_CONFIG: cfg.AKSA_CONFIG,
    AKSA_PRODUCTS,
    waLink: cfg.waLink,
    telLink: cfg.telLink,
    ICONS: new Proxy({}, { get: () => "<svg></svg>" }),
  }
);

const fallbackText = bot.fallback("x").text;

function asks(question, expectContains) {
  const reply = bot.answer(question);
  const hit = reply.text.toLowerCase().includes(expectContains.toLowerCase());
  if (hit) { passed++; console.log(`  ok    "${question}"`); }
  else {
    failed++;
    console.log(`  FAIL  "${question}"\n          expected reply to mention: ${expectContains}\n          got: ${reply.text.slice(0, 110).replace(/\n/g, " ")}…`);
  }
}

asks("hello",                                    "assistant");
asks("what products do you make?",               "circles");
asks("tell me about brass circles",              "Brass Circles");
asks("what thickness do copper strips come in",  "Copper Strips");
asks("how much does copper cost",                "LME");
asks("what is the rate per kg",                  "LME");
asks("kya rate hai",                             "LME");
asks("how do I calculate weight",                "8.96");
asks("what is your minimum order",               "50");
asks("how long is delivery",                     "working days");
asks("do you have ISO certification",            "mill test certificate");
asks("where are you located",                    "Bidar");
asks("what are your phone numbers",              AKSA_PRODUCTS ? cfg.AKSA_CONFIG.phone1 : "");
asks("can you do a custom size",                 "made to order");
asks("why should I buy from a new company",      "trial");
asks("which industries do you supply",           "Electrical");
asks("what payment terms do you offer",          "advance");
asks("do you export",                            "India");
asks("thanks, that helps",                       "Happy to help");

/* Product detection should be exact, not fuzzy across metals. */
console.log("\nASSISTANT — product detection");
console.log("──────────────────────────────────────────────────────────");
check("'brass foil' resolves to brass-foil",
  bot.detectProduct(bot.normalise("do you have brass foil")).slug, "brass-foil");
check("'copper plate' resolves to copper-plate",
  bot.detectProduct(bot.normalise("price of copper plate")).slug, "copper-plate");
check("'patra' (sheet) + copper resolves to copper-sheet",
  bot.detectProduct(bot.normalise("copper patra chahiye")).slug, "copper-sheet");
check("metal with no form resolves to nothing specific",
  bot.detectProduct(bot.normalise("i need copper")), null);

/* Nonsense must reach the hand-off, not a confident wrong answer. */
console.log("\nASSISTANT — unknown questions hand off");
console.log("──────────────────────────────────────────────────────────");
const nonsense = ["asdfghjkl", "what is the weather in paris", "qqqq zzzz"];
let allFellBack = true;
for (const q of nonsense) {
  const got = bot.answer(q).text;
  if (got !== fallbackText) { allFellBack = false; console.log(`        "${q}" did not fall back`); }
}
check("Nonsense questions hand off to the sales team", allFellBack, true);

/* ========================================================================== *
   3 — PRODUCT DATA INTEGRITY
 * ========================================================================== */
console.log("\nPRODUCT DATA — integrity");
console.log("──────────────────────────────────────────────────────────");

const required = ["slug", "name", "metal", "family", "calcShape", "image",
                  "tagline", "intro", "highlights", "grades", "tempers",
                  "specs", "standards", "applications"];
let complete = true;
for (const p of AKSA_PRODUCTS) {
  for (const key of required) {
    if (!p[key] || (Array.isArray(p[key]) && !p[key].length)) {
      complete = false;
      console.log(`        ${p.slug} is missing "${key}"`);
    }
  }
  if (!calc.SHAPES[p.calcShape]) {
    complete = false;
    console.log(`        ${p.slug} has calcShape "${p.calcShape}" which is not a real shape`);
  }
  if (!p.specs.some((s) => s.label === "Thickness")) {
    complete = false;
    console.log(`        ${p.slug} has no Thickness spec`);
  }
}
check("All 12 products have every required field", complete, true);
check("Slugs are unique", new Set(AKSA_PRODUCTS.map((p) => p.slug)).size, 12);
check("Six copper products", AKSA_PRODUCTS.filter((p) => p.metal === "copper").length, 6);
check("Six brass products",  AKSA_PRODUCTS.filter((p) => p.metal === "brass").length, 6);

/* ---------------------------------------------------------------- Report -- */
console.log("\n──────────────────────────────────────────────────────────");
console.log(`${passed} passed, ${failed} failed`);
process.exit(failed ? 1 : 0);
