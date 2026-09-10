/* ============================================================================
   AKSA METALS — METAL WEIGHT CALCULATOR
   ----------------------------------------------------------------------------
   Weight = Volume × Density

   All dimensions are entered in millimetres (or metres for long products) and
   converted to cm³ before multiplying by density in g/cm³.

   Densities are the standard published figures for each alloy. If your mill
   works to a different figure, change the number in DENSITY below.
   ============================================================================ */

const DENSITY = {
  /* ---- Copper ---- */
  c11000: { label: "Copper C11000 (ETP)",  short: "Copper ETP",     d: 8.96, metal: "copper" },
  c10200: { label: "Copper C10200 (OF)",   short: "Copper OF",      d: 8.94, metal: "copper" },
  c12200: { label: "Copper C12200 (DHP)",  short: "Copper DHP",     d: 8.94, metal: "copper" },

  /* ---- Brass ---- */
  cuzn30: { label: "Brass CuZn30 (70/30)", short: "Brass 70/30",    d: 8.53, metal: "brass" },
  cuzn37: { label: "Brass CuZn37 (63/37)", short: "Brass 63/37",    d: 8.44, metal: "brass" },
  cuzn40: { label: "Brass CuZn40 (Muntz)", short: "Brass Muntz",    d: 8.39, metal: "brass" },
  naval:  { label: "Naval Brass C46400",   short: "Naval brass",    d: 8.41, metal: "brass" },
  pbfree: { label: "Lead-Free Brass",      short: "Lead-free brass",d: 8.45, metal: "brass" },
};

const SHAPES = {
  circle: {
    label: "Circle",
    fields: [
      { id: "dia", label: "Diameter (mm)",  ph: "300" },
      { id: "thk", label: "Thickness (mm)", ph: "0.8" },
    ],
    /* volume in mm³ */
    volume: (v) => Math.PI * Math.pow(v.dia / 2, 2) * v.thk,
    describe: (v) => `Circle · Ø${v.dia} mm × ${v.thk} mm`,
  },

  sheet: {
    label: "Sheet / Plate",
    fields: [
      { id: "len", label: "Length (mm)",    ph: "1000" },
      { id: "wid", label: "Width (mm)",     ph: "500" },
      { id: "thk", label: "Thickness (mm)", ph: "1.2" },
    ],
    volume: (v) => v.len * v.wid * v.thk,
    describe: (v) => `Sheet · ${v.len} × ${v.wid} × ${v.thk} mm`,
  },

  strip: {
    label: "Strip / Coil",
    fields: [
      { id: "len", label: "Length (metres)", ph: "50" },
      { id: "wid", label: "Width (mm)",      ph: "40" },
      { id: "thk", label: "Thickness (mm)",  ph: "0.5" },
    ],
    volume: (v) => v.len * 1000 * v.wid * v.thk,
    describe: (v) => `Strip · ${v.len} m × ${v.wid} mm × ${v.thk} mm`,
  },

  rod: {
    label: "Rod / Bar",
    fields: [
      { id: "dia", label: "Diameter (mm)",   ph: "12" },
      { id: "len", label: "Length (metres)", ph: "3" },
    ],
    volume: (v) => Math.PI * Math.pow(v.dia / 2, 2) * v.len * 1000,
    describe: (v) => `Rod · Ø${v.dia} mm × ${v.len} m`,
  },

  tube: {
    label: "Tube / Pipe",
    fields: [
      { id: "od",  label: "Outer diameter (mm)", ph: "25" },
      { id: "wall",label: "Wall thickness (mm)", ph: "1.5" },
      { id: "len", label: "Length (metres)",     ph: "3" },
    ],
    volume: (v) => {
      const inner = Math.max(v.od - 2 * v.wall, 0);
      return Math.PI * (Math.pow(v.od / 2, 2) - Math.pow(inner / 2, 2)) * v.len * 1000;
    },
    describe: (v) => `Tube · Ø${v.od} mm × ${v.wall} mm wall × ${v.len} m`,
    /* Guard against a wall thicker than the radius, which is not a tube. */
    validate: (v) => (v.wall * 2 >= v.od ? "Wall thickness must be less than half the outer diameter." : null),
  },

  wire: {
    label: "Wire",
    fields: [
      { id: "dia", label: "Diameter (mm)",   ph: "2.5" },
      { id: "len", label: "Length (metres)", ph: "500" },
    ],
    volume: (v) => Math.PI * Math.pow(v.dia / 2, 2) * v.len * 1000,
    describe: (v) => `Wire · Ø${v.dia} mm × ${v.len} m`,
  },
};

let curAlloy = "c11000";
let curShape = "circle";
let lastResult = null;

/* ------------------------------------------------------------- Helpers --- */
function formatWeight(kg) {
  if (!isFinite(kg) || kg <= 0) return "—";
  if (kg >= 1000) return (kg / 1000).toFixed(3) + " t";
  if (kg >= 1)    return kg.toFixed(2) + " kg";
  return (kg * 1000).toFixed(1) + " g";
}

function renderAlloys() {
  const wrap = document.getElementById("metalSeg");
  if (!wrap) return;
  wrap.innerHTML = Object.entries(DENSITY)
    .map(([key, a]) =>
      `<button type="button" data-alloy="${key}" class="${key === curAlloy ? "on metal-" + a.metal : ""}">
         ${a.short}
       </button>`
    )
    .join("");
  wrap.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => {
      curAlloy = b.dataset.alloy;
      renderAlloys();
      calculate();
    })
  );
}

function renderShapes() {
  const wrap = document.getElementById("shapeSeg");
  if (!wrap) return;
  wrap.innerHTML = Object.entries(SHAPES)
    .map(([key, s]) =>
      `<button type="button" data-shape="${key}" class="${key === curShape ? "on" : ""}">${s.label}</button>`
    )
    .join("");
  wrap.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => {
      curShape = b.dataset.shape;
      renderShapes();
      renderFields();
    })
  );
}

function renderFields() {
  const wrap = document.getElementById("dimFields");
  if (!wrap) return;
  const shape = SHAPES[curShape];

  wrap.innerHTML = shape.fields
    .map(
      (f) => `
      <div class="field">
        <label for="${f.id}">${f.label}</label>
        <input type="number" id="${f.id}" placeholder="e.g. ${f.ph}" min="0" step="any"
               inputmode="decimal" autocomplete="off" />
      </div>`
    )
    .join("");

  wrap.querySelectorAll("input").forEach((i) => i.addEventListener("input", calculate));
  calculate();
}

/* ----------------------------------------------------------- Calculate --- */
function calculate() {
  const shape = SHAPES[curShape];
  const alloy = DENSITY[curAlloy];

  const out      = document.getElementById("resultValue");
  const detail   = document.getElementById("resultDetail");
  const quoteBtn = document.getElementById("quoteFromCalc");
  const copyBtn  = document.getElementById("copyResult");
  const perPiece = document.getElementById("calcPerPiece");
  const totalPcs = document.getElementById("calcQty");
  const alloyOut = document.getElementById("calcAlloy");
  if (!out) return;

  /* Read the dimension inputs */
  const vals = {};
  let complete = true;
  for (const f of shape.fields) {
    const el = document.getElementById(f.id);
    const n = parseFloat(el && el.value);
    if (!isFinite(n) || n <= 0) complete = false;
    vals[f.id] = n;
  }

  const qtyEl = document.getElementById("qty");
  const qty = Math.max(1, parseInt(qtyEl && qtyEl.value, 10) || 1);

  function blank(message) {
    lastResult = null;
    out.textContent = "—";
    detail.textContent = message;
    if (perPiece) perPiece.textContent = "—";
    if (totalPcs) totalPcs.textContent = qty + (qty > 1 ? " pcs" : " pc");
    if (alloyOut) alloyOut.textContent = alloy.short;
    if (copyBtn)  copyBtn.disabled = true;
    if (quoteBtn) quoteBtn.href = waLink("Hello Aksa Metals, I would like a quote.");
  }

  if (!complete) return blank("Enter the dimensions to see the weight");

  /* Shape-specific sanity check (e.g. tube wall vs diameter) */
  if (shape.validate) {
    const problem = shape.validate(vals);
    if (problem) return blank(problem);
  }

  const volumeMm3 = shape.volume(vals);
  if (!isFinite(volumeMm3) || volumeMm3 <= 0) return blank("Those dimensions don't produce a solid shape");

  const gramsEach = (volumeMm3 / 1000) * alloy.d;   /* mm³ → cm³ → grams */
  const kgEach    = gramsEach / 1000;
  const kgTotal   = kgEach * qty;

  const description = shape.describe(vals);
  lastResult = {
    alloy: alloy.label,
    description,
    qty,
    each: formatWeight(kgEach),
    total: formatWeight(kgTotal),
  };

  out.textContent = formatWeight(kgTotal);
  detail.textContent = `${alloy.label} · ${description}`;
  if (perPiece) perPiece.textContent = formatWeight(kgEach);
  if (totalPcs) totalPcs.textContent = qty + (qty > 1 ? " pcs" : " pc");
  if (alloyOut) alloyOut.textContent = alloy.short;
  if (copyBtn)  copyBtn.disabled = false;

  if (quoteBtn) {
    quoteBtn.href = waLink(
      "Hello Aksa Metals, I would like a quote for:\n\n" +
      `Material: ${alloy.label}\n` +
      `Size: ${description}\n` +
      `Quantity: ${qty} pcs\n` +
      `Estimated weight: ${formatWeight(kgTotal)}\n\n` +
      "Please send me your best rate."
    );
  }
}

/* ------------------------------------------------------------ Clipboard -- */
function copyResult() {
  if (!lastResult) return;
  const text =
    "Aksa Metals — weight estimate\n" +
    `Material: ${lastResult.alloy}\n` +
    `Size: ${lastResult.description}\n` +
    `Quantity: ${lastResult.qty} pcs\n` +
    `Weight per piece: ${lastResult.each}\n` +
    `Total weight: ${lastResult.total}`;

  const done = () => {
    const toast = document.getElementById("copiedToast");
    if (!toast) return;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 1900);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }

  /* file:// pages and older browsers have no clipboard API */
  function fallbackCopy() {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { /* nothing more we can do */ }
    document.body.removeChild(ta);
  }
}

/* ----------------------------------------------------------------- Boot -- */
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("dimFields")) return;   /* not the calculator page */

  /* Allow another page to link in with a shape preselected:
     weight-calculator.html?shape=circle                                     */
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get("shape");
  if (wanted && SHAPES[wanted]) curShape = wanted;
  const wantedMetal = params.get("metal");
  if (wantedMetal === "brass") curAlloy = "cuzn30";

  renderAlloys();
  renderShapes();
  renderFields();

  const qtyEl = document.getElementById("qty");
  if (qtyEl) qtyEl.addEventListener("input", calculate);

  const copyBtn = document.getElementById("copyResult");
  if (copyBtn) copyBtn.addEventListener("click", copyResult);

  const resetBtn = document.getElementById("resetCalc");
  if (resetBtn) resetBtn.addEventListener("click", () => {
    document.querySelectorAll("#dimFields input").forEach((i) => (i.value = ""));
    if (qtyEl) qtyEl.value = 1;
    calculate();
  });
});
