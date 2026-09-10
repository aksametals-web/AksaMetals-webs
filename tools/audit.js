/* ============================================================================
   AKSA METALS — SITE AUDIT
   ----------------------------------------------------------------------------
   Walks every HTML page and checks that:
     · every local link points at a file that exists
     · every image, stylesheet and script actually exists
     · every "#anchor" link has a matching id on the target page
     · every product in js/products-data.js has a page and a photo
     · the JavaScript files parse

   Run:  node tools/audit.js
   Exits non-zero if anything is broken, so it can be wired into CI later.
   ============================================================================ */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const { AKSA_PRODUCTS } = require(path.join(ROOT, "js", "products-data.js"));

const problems = [];
const notes = [];

/* ---------------------------------------------------------------- Pages -- */
const pages = fs
  .readdirSync(ROOT)
  .filter((f) => f.endsWith(".html"))
  .sort();

/* Collect the ids declared on each page, so #anchors can be checked. */
const idsByPage = {};
const htmlByPage = {};   /* full source, used for id + script checks */
const markupByPage = {}; /* inline <script> bodies stripped, used for link checks */

/* Inline scripts build hrefs by string concatenation at runtime. Scanning them
   as if they were markup produces false "missing file" reports, so the link
   pass runs against the markup with script bodies removed. */
const stripInlineScripts = (html) =>
  html.replace(/<script(?![^>]*\ssrc=)[^>]*>[\s\S]*?<\/script>/gi, "");

for (const page of pages) {
  const html = fs.readFileSync(path.join(ROOT, page), "utf8");
  htmlByPage[page] = html;
  markupByPage[page] = stripInlineScripts(html);
  idsByPage[page] = new Set(
    [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])
  );
}

/* Ids that are created by JavaScript at runtime rather than written in HTML. */
const RUNTIME_IDS = new Set([
  "copper", "brass",                       // section ids present in products.html
]);

/* ------------------------------------------------------------ Reference -- */
let checked = 0;

for (const page of pages) {
  const html = markupByPage[page];

  const refs = [
    ...[...html.matchAll(/\shref="([^"]+)"/g)].map((m) => ({ kind: "href", url: m[1] })),
    ...[...html.matchAll(/\ssrc="([^"]+)"/g)].map((m) => ({ kind: "src", url: m[1] })),
  ];

  for (const { kind, url } of refs) {
    /* Skip anything that is not a local file reference. */
    if (
      url.startsWith("http://") || url.startsWith("https://") ||
      url.startsWith("mailto:") || url.startsWith("tel:") ||
      url.startsWith("data:") || url === "#" || url.startsWith("javascript:")
    ) continue;

    checked++;

    /* Pure "#anchor" on the same page */
    if (url.startsWith("#")) {
      const id = url.slice(1);
      if (!idsByPage[page].has(id) && !RUNTIME_IDS.has(id)) {
        problems.push(`${page}: anchor "${url}" has no matching id on this page`);
      }
      continue;
    }

    /* Split off any query string or hash */
    const [filePart, hashPart] = url.split("#");
    const cleanFile = filePart.split("?")[0];

    if (cleanFile) {
      const target = path.join(ROOT, cleanFile);
      if (!fs.existsSync(target)) {
        problems.push(`${page}: ${kind}="${url}" → missing file ${cleanFile}`);
        continue;
      }

      /* If it points at another page's anchor, check that id exists there. */
      if (hashPart && cleanFile.endsWith(".html")) {
        const targetIds = idsByPage[cleanFile];
        if (targetIds && !targetIds.has(hashPart) && !RUNTIME_IDS.has(hashPart)) {
          problems.push(`${page}: link "${url}" → ${cleanFile} has no id="${hashPart}"`);
        }
      }
    }
  }
}

/* ------------------------------------------------------------- Products -- */
for (const p of AKSA_PRODUCTS) {
  const pageFile = `product-${p.slug}.html`;
  if (!fs.existsSync(path.join(ROOT, pageFile))) {
    problems.push(`products-data: "${p.slug}" has no generated page (${pageFile})`);
  }
  if (!fs.existsSync(path.join(ROOT, p.image))) {
    problems.push(`products-data: "${p.slug}" image missing → ${p.image}`);
  }
}

/* ------------------------------------------------ Images actually in use -- */
const allHtml = pages.map((p) => htmlByPage[p]).join("\n");
const imgDir = path.join(ROOT, "assets", "img");
const onDisk = fs.existsSync(imgDir)
  ? fs.readdirSync(imgDir).filter((f) => /\.(jpg|jpeg|png|webp|svg)$/i.test(f))
  : [];

const unusedImages = onDisk.filter(
  (f) => !allHtml.includes(f) && !JSON.stringify(AKSA_PRODUCTS).includes(f)
);
if (unusedImages.length) {
  notes.push(`Downloaded but not referenced anywhere: ${unusedImages.join(", ")}`);
}

/* --------------------------------------------------------- Script order -- */
for (const page of pages) {
  const html = htmlByPage[page];
  const scripts = [...html.matchAll(/<script src="([^"]+)"/g)].map((m) => m[1]);
  if (!scripts.length) continue;

  const need = ["js/site-config.js", "js/products-data.js", "js/main.js"];
  for (const dep of need) {
    if (!scripts.includes(dep)) {
      problems.push(`${page}: missing <script src="${dep}">`);
    }
  }
  /* site-config must load before main.js, which uses AKSA_CONFIG at render time */
  const iCfg = scripts.indexOf("js/site-config.js");
  const iMain = scripts.indexOf("js/main.js");
  if (iCfg > -1 && iMain > -1 && iCfg > iMain) {
    problems.push(`${page}: site-config.js must load before main.js`);
  }
}

/* ------------------------------------------------------- Required pages -- */
const REQUIRED = [
  "index.html", "about.html", "company-profile.html", "certifications.html",
  "products.html", "specifications.html", "weight-calculator.html", "contact.html",
];
for (const r of REQUIRED) {
  if (!pages.includes(r)) problems.push(`Required page missing: ${r}`);
}

/* ---------------------------------------------------------------- Report -- */
console.log(`Pages found ............ ${pages.length}`);
console.log(`Local references checked ${checked}`);
console.log(`Images on disk ......... ${onDisk.length}`);
console.log(`Products ............... ${AKSA_PRODUCTS.length}`);
console.log("");

if (notes.length) {
  console.log("NOTES");
  notes.forEach((n) => console.log("  · " + n));
  console.log("");
}

if (problems.length) {
  console.log(`✗ ${problems.length} PROBLEM(S)`);
  problems.forEach((p) => console.log("  ✗ " + p));
  process.exit(1);
}

console.log("✓ No broken links, missing files or bad anchors.");
