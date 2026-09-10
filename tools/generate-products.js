/* ============================================================================
   AKSA METALS — PRODUCT PAGE GENERATOR
   ----------------------------------------------------------------------------
   Reads js/products-data.js and writes one static HTML page per product:

       product-copper-circle.html … product-brass-foil.html

   WHY THIS EXISTS
   Twelve near-identical pages maintained by hand drift apart within a month.
   This keeps them identical in structure while the content comes from one
   data file, so updating a thickness range means editing one number.

   HOW TO RUN  (only needed after editing js/products-data.js)
       node tools/generate-products.js

   The generated .html files are plain static pages. Whoever hosts the site
   never needs Node installed.
   ============================================================================ */

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const { AKSA_PRODUCTS } = require(path.join(ROOT, "js", "products-data.js"));

/* --------------------------------------------------------------- Helpers -- */
const esc = (s) =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const spec = (p, label) => {
  const hit = p.specs.find((s) => s.label === label);
  return hit ? hit.value : null;
};

/* --------------------------------------------------------------- Template -- */
function page(p) {
  const metalLabel = p.metal === "copper" ? "Copper" : "Brass";
  const siblings = AKSA_PRODUCTS.filter((s) => s.metal === p.metal && s.slug !== p.slug);
  const crossMetal = AKSA_PRODUCTS.find(
    (s) => s.metal !== p.metal && s.family === p.family
  );

  const thickness = spec(p, "Thickness");
  const sizeLabel = spec(p, "Diameter") ? "Diameter" : "Width";
  const sizeValue = spec(p, "Diameter") || spec(p, "Width");

  const waMessage =
    "Hello Aksa Metals, I would like a quote for " + p.name + ".\n\n" +
    "Grade:\n" +
    "Thickness:\n" +
    sizeLabel + ":\n" +
    "Temper:\n" +
    "Quantity: ";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(p.name)} Manufacturer in Bidar — Aksa Metals</title>
  <meta name="description" content="${esc(p.name)} from Aksa Metals, Bidar. ${esc(p.tagline)} Thickness ${esc(thickness || "")}${sizeValue ? ", " + sizeLabel.toLowerCase() + " " + esc(sizeValue) : ""}. Grades ${esc(p.grades.join(", "))}. Mill test certificate with every batch." />
  <link rel="icon" href="assets/favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
</head>
<body data-page="products">
  <div id="app-header"></div>

  <!-- ══════════════════════════ HERO ══════════════════════ -->
  <section class="page-hero">
    <div class="hero-bg tint-${p.metal}">
      <img src="${p.image}" alt="" loading="eager" width="900" height="675" />
    </div>
    <div class="hero-scrim"></div>
    <div class="container">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="index.html">Home</a><span>/</span>
        <a href="products.html">Products</a><span>/</span>
        <a href="products.html#${p.metal}">${metalLabel}</a><span>/</span>
        <span>${esc(p.name)}</span>
      </nav>
      <h1>${esc(p.name)}</h1>
      <p class="lede">${esc(p.tagline)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="contact.html?product=${p.slug}">Get a Quote</a>
        <a class="btn btn-ghost-light" href="weight-calculator.html?shape=${p.calcShape}&amp;metal=${p.metal}">Calculate Weight</a>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════ OVERVIEW ══════════════════════ -->
  <section class="section">
    <div class="container">
      <div class="feature-row">
        <div class="reveal">
          <span class="eyebrow">${metalLabel} · ${esc(p.family)}</span>
          <h2>About ${esc(p.name)}</h2>
          <div class="prose mt-2">
            <p>${esc(p.intro)}</p>
          </div>

          <ul class="feature-list">
${p.highlights.map((h) => `            <li><span class="tick">✓</span><span>${esc(h)}</span></li>`).join("\n")}
          </ul>

          <div class="flex mt-3">
            <a class="btn btn-primary" href="contact.html?product=${p.slug}">Request a Quote</a>
            <a class="btn btn-ghost" href="specifications.html#${p.metal}-specs">Full Specifications</a>
          </div>
        </div>

        <div class="feature-media reveal tint-${p.metal}">
          <img src="${p.image}" alt="${esc(p.name)}" loading="lazy" width="900" height="675" />
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════ SPECIFICATIONS ══════════════════════ -->
  <section class="section alt">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Specifications</span>
        <h2>What we can supply.</h2>
        <p class="lede mt-1">
          These are the limits of what we roll — sizes in between are made to order.
        </p>
      </div>

      <div class="grid grid-2" style="align-items:start">
        <div class="table-wrap reveal">
          <table>
            <thead><tr><th>Property</th><th>Specification</th></tr></thead>
            <tbody>
${p.specs.map((s) => `              <tr><td>${esc(s.label)}</td><td>${esc(s.value)}</td></tr>`).join("\n")}
            </tbody>
          </table>
        </div>

        <div class="reveal">
          <div class="card mb-2">
            <h3 style="font-size:1.05rem">Available grades</h3>
            <div class="chips mt-2">
${p.grades.map((g) => `              <span class="chip chip-${p.metal}">${esc(g)}</span>`).join("\n")}
            </div>
          </div>

          <div class="card mb-2">
            <h3 style="font-size:1.05rem">Tempers</h3>
            <div class="chips mt-2">
${p.tempers.map((t) => `              <span class="chip">${esc(t)}</span>`).join("\n")}
            </div>
          </div>

          <div class="card">
            <h3 style="font-size:1.05rem">Standards</h3>
            <div class="chips mt-2">
${p.standards.map((s) => `              <span class="chip">${esc(s)}</span>`).join("\n")}
            </div>
          </div>
        </div>
      </div>

      <div class="note mt-4 reveal">
        <span class="note-icon">✱</span>
        <div>
          <b>Need something outside these ranges?</b> Ask anyway — the limits above are what we
          roll as standard, and we can often accommodate more. Send your drawing and we will
          confirm before you order.
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════ APPLICATIONS ══════════════════════ -->
  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Applications</span>
        <h2>Where ${esc(p.name.toLowerCase())} are used.</h2>
      </div>

      <div class="grid grid-3">
${p.applications
  .map(
    (a, i) => `        <div class="card reveal">
          <div class="card-num">${String(i + 1).padStart(2, "0")}</div>
          <h3 style="font-size:1.05rem">${esc(a)}</h3>
        </div>`
  )
  .join("\n")}
      </div>
    </div>
  </section>

  <!-- ══════════════════════════ WEIGHT HELPER ══════════════════════ -->
  <section class="section-tight alt">
    <div class="container">
      <div class="cta-band reveal">
        <div>
          <span class="eyebrow on-dark">Free Tool</span>
          <h2>Work out the weight before you order.</h2>
          <p>
            The calculator opens with ${esc(metalLabel.toLowerCase())} and the right shape already
            selected — just type in your dimensions.
          </p>
        </div>
        <div class="flex">
          <a class="btn btn-ghost-light btn-lg" href="weight-calculator.html?shape=${p.calcShape}&amp;metal=${p.metal}">
            Open Calculator
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- ══════════════════════════ RELATED ══════════════════════ -->
  <section class="section">
    <div class="container">
      <div class="section-head reveal">
        <span class="eyebrow">Also Available</span>
        <h2>Other ${esc(metalLabel.toLowerCase())} products.</h2>
      </div>

      <div class="grid grid-3">
${siblings
  .map(
    (s) => `        <a class="card product-card reveal tint-${s.metal}" href="product-${s.slug}.html">
          <div class="product-thumb">
            <span class="tag tag-${s.metal}">${s.metal}</span>
            <img src="${s.image}" alt="${esc(s.name)}" loading="lazy" width="900" height="675" />
          </div>
          <div class="product-body">
            <h3>${esc(s.name)}</h3>
            <p>${esc(s.tagline)}</p>
            <span class="link-arrow">View details</span>
          </div>
        </a>`
  )
  .join("\n")}
      </div>

${
  crossMetal
    ? `      <div class="center mt-4 reveal">
        <p class="muted mb-2">Looking for the same form in the other metal?</p>
        <a class="btn btn-ghost" href="product-${crossMetal.slug}.html">See ${esc(crossMetal.name)}</a>
      </div>`
    : ""
}
    </div>
  </section>

  <!-- ══════════════════════════ CTA ══════════════════════ -->
  <section class="section-tight" style="padding-bottom:92px">
    <div class="container">
      <div class="cta-band reveal">
        <div>
          <h2>Get a price on ${esc(p.name.toLowerCase())}.</h2>
          <p>Send your size and quantity — a firm quote usually comes back the same working day.</p>
        </div>
        <div class="flex">
          <a class="btn btn-whatsapp btn-lg" data-wa="${esc(waMessage)}">WhatsApp Quote</a>
          <a class="btn btn-ghost-light btn-lg" href="contact.html?product=${p.slug}">Enquiry Form</a>
        </div>
      </div>
    </div>
  </section>

  <div id="app-footer"></div>

  <script src="js/site-config.js"></script>
  <script src="js/products-data.js"></script>
  <script src="js/main.js"></script>
  <script src="js/assistant.js"></script>
</body>
</html>
`;
}

/* ------------------------------------------------------------------ Run -- */
let written = 0;
for (const product of AKSA_PRODUCTS) {
  const file = path.join(ROOT, `product-${product.slug}.html`);
  fs.writeFileSync(file, page(product), "utf8");
  written++;
  console.log(`  wrote  product-${product.slug}.html`);
}
console.log(`\nGenerated ${written} product page(s).`);
