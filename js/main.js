/* ============================================================================
   AKSA METALS — SHARED LAYOUT
   ----------------------------------------------------------------------------
   Builds the header, navigation, mobile drawer and footer on every page so
   there is only ONE copy of the menu to maintain.

   You should not need to edit this file. Contact details, phone numbers and
   the WhatsApp number all come from js/site-config.js.
   ============================================================================ */

/* ------------------------------------------------------------- Icons ----- */
const ICONS = {
  phone:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
  clock:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  pin:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>',
  whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2m0 1.67c4.54 0 8.24 3.7 8.24 8.24s-3.7 8.24-8.24 8.24c-1.48 0-2.93-.39-4.19-1.15l-.3-.17-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.55 3.7-8.25 8.24-8.25m-3.53 4.02c-.16 0-.43.06-.66.31-.22.25-.87.85-.87 2.07 0 1.22.89 2.4 1 2.56.13.17 1.76 2.67 4.25 3.73 2.07.88 2.49.7 2.94.66.45-.04 1.44-.59 1.64-1.16.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.28-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.78.97-.15.17-.29.19-.53.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.51.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.48-.4-.42-.56-.42-.14-.01-.3-.01-.47-.01z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>',
  send:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>',
  spark:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l1.9 6.1L20 10l-6.1 1.9L12 18l-1.9-6.1L4 10l6.1-1.9L12 2z"/></svg>',
  factory:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h20V9l-6 4V9l-6 4V4H2z"/><path d="M6 20v-4M11 20v-4M16 20v-4"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>',
  truck:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6H2v12h2"/><path d="M14 9h4l4 4v5h-2"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M9 18h6"/></svg>',
  handshake:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.9-3.9a2 2 0 0 1 0-2.8L17 4"/><path d="M7 17 4 14a2 2 0 0 1 0-2.8l4-4a2 2 0 0 1 2.8 0L14 10"/></svg>',
  flask:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.5L4.6 18A2 2 0 0 0 6.3 21h11.4a2 2 0 0 0 1.7-3L14 9.5V2"/><path d="M8.5 2h7"/><path d="M7 15h10"/></svg>',
  ruler:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 8.7 8.7 21.3a1 1 0 0 1-1.4 0l-4.6-4.6a1 1 0 0 1 0-1.4L15.3 2.7a1 1 0 0 1 1.4 0l4.6 4.6a1 1 0 0 1 0 1.4z"/><path d="m7.5 10.5 2 2M10.5 7.5l2 2M13.5 4.5l2 2"/></svg>',
  leaf:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/></svg>',
  facebook:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z"/></svg>',
  linkedin:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.55V9h3.57zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0"/></svg>',
  instagram:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.9C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.3 1.46-.72 2.13-1.38a5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0m0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8m7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0"/></svg>',
};

/* ---------------------------------------------------- Navigation model --- */
const NAV_COMPANY = [
  { href: "about.html",                          label: "About Us" },
  { href: "company-profile.html",                label: "Company Profile" },
  { divider: true },
  { href: "company-profile.html#infrastructure", label: "Infrastructure" },
  { href: "company-profile.html#process",        label: "Manufacturing Process" },
  { href: "company-profile.html#quality",        label: "Quality Assurance" },
  { href: "company-profile.html#why-us",         label: "Why Aksa Metals" },
  { href: "company-profile.html#clients",        label: "Our Clients" },
  { href: "company-profile.html#environment",    label: "Environmental Policy" },
  { divider: true },
  { href: "certifications.html",                 label: "Certifications" },
];

/* --------------------------------------------------------------- Header -- */
function renderHeader() {
  const page = document.body.dataset.page || "";
  const on = (p) => (p === page ? "active" : "");
  const C = AKSA_CONFIG;

  const copper = AKSA_PRODUCTS.filter((p) => p.metal === "copper");
  const brass  = AKSA_PRODUCTS.filter((p) => p.metal === "brass");
  const link   = (p) => `<a href="product-${p.slug}.html">${p.name}</a>`;

  const companyItems = NAV_COMPANY.map((i) =>
    i.divider ? "<hr>" : `<a href="${i.href}">${i.label}</a>`
  ).join("");

  return `
  <div class="topbar">
    <div class="container">
      <div class="topbar-left">
        <span>${ICONS.phone}<a href="${telLink(C.phone1)}">${C.phone1}</a></span>
        <span>${ICONS.mail}<a href="mailto:${C.email}">${C.email}</a></span>
      </div>
      <div class="topbar-right">
        <span>${ICONS.clock} ${C.hours}</span>
      </div>
    </div>
  </div>

  <header class="site-header">
    <div class="container nav-wrap">
      <a class="logo" href="index.html" aria-label="${C.name} — home">
        <div class="logo-mark">A</div>
        <div class="logo-text">
          <strong>${C.name}</strong>
          <span>Copper &middot; Brass</span>
        </div>
      </a>

      <nav class="main-nav" aria-label="Main">
        <a href="index.html" class="${on("home")}">Home</a>

        <div class="dropdown">
          <button type="button" class="${["about","profile","certs"].includes(page) ? "active" : ""}">
            Company <span class="caret">▼</span>
          </button>
          <div class="dropdown-menu">${companyItems}</div>
        </div>

        <div class="dropdown">
          <button type="button" class="${page === "products" ? "active" : ""}">
            Products <span class="caret">▼</span>
          </button>
          <div class="dropdown-menu wide">
            <div class="menu-col">
              <div class="menu-label">Copper</div>
              ${copper.map(link).join("")}
            </div>
            <div class="menu-col">
              <div class="menu-label">Brass</div>
              ${brass.map(link).join("")}
            </div>
            <div class="menu-col" style="grid-column:1/-1">
              <hr>
              <a href="products.html"><strong>View all products →</strong></a>
            </div>
          </div>
        </div>

        <a href="specifications.html"   class="${on("specs")}">Specifications</a>
        <a href="weight-calculator.html" class="${on("calc")}">Weight Calculator</a>
        <a href="contact.html"          class="${on("contact")}">Contact</a>
      </nav>

      <div class="nav-cta">
        <a class="btn btn-ghost btn-sm" href="${C.brochure}" download>Brochure</a>
        <a class="btn btn-primary btn-sm" href="contact.html">Get a Quote</a>
        <button class="hamburger" id="hamburger" aria-label="Open menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>
  </header>

  <div class="nav-scrim" id="navScrim"></div>

  <aside class="drawer" id="drawer" aria-label="Mobile menu">
    <div class="drawer-head">
      <a class="logo" href="index.html">
        <div class="logo-mark">A</div>
        <div class="logo-text"><strong>${C.name}</strong><span>Copper &middot; Brass</span></div>
      </a>
      <button class="drawer-close" id="drawerClose" aria-label="Close menu">&times;</button>
    </div>

    <div class="drawer-body">
      <a href="index.html" class="${on("home")}">Home</a>

      <div class="drawer-group">
        <button type="button">Company <span class="caret">▼</span></button>
        <div class="drawer-sub"><div class="drawer-sub-inner">
          ${NAV_COMPANY.filter((i) => !i.divider).map((i) => `<a href="${i.href}">${i.label}</a>`).join("")}
        </div></div>
      </div>

      <div class="drawer-group">
        <button type="button">Products <span class="caret">▼</span></button>
        <div class="drawer-sub"><div class="drawer-sub-inner">
          <a href="products.html"><strong>All Products</strong></a>
          ${AKSA_PRODUCTS.map((p) => `<a href="product-${p.slug}.html">${p.name}</a>`).join("")}
        </div></div>
      </div>

      <a href="specifications.html"    class="${on("specs")}">Specifications</a>
      <a href="weight-calculator.html" class="${on("calc")}">Weight Calculator</a>
      <a href="contact.html"           class="${on("contact")}">Contact</a>
    </div>

    <div class="drawer-foot">
      <a class="btn btn-primary" href="contact.html">Get a Quote</a>
      <a class="btn btn-ghost" href="${C.brochure}" download>Download Brochure</a>
      <div class="drawer-contact">
        <a href="${telLink(C.phone1)}">${C.phone1}</a>
        <a href="mailto:${C.email}">${C.email}</a>
        <span>${C.hours}</span>
      </div>
    </div>
  </aside>`;
}

/* --------------------------------------------------------------- Footer -- */
function renderFooter() {
  const C = AKSA_CONFIG;
  const year = new Date().getFullYear();

  const socials = [
    ["facebook",  C.facebook],
    ["linkedin",  C.linkedin],
    ["instagram", C.instagram],
  ].filter(([, url]) => url);

  return `
  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">

        <div class="footer-about">
          <a class="logo" href="index.html">
            <div class="logo-mark">A</div>
            <div class="logo-text">
              <strong style="color:#fff">${C.name}</strong>
              <span>Copper &middot; Brass</span>
            </div>
          </a>
          <p>Precision-rolled copper and brass for vendors, fabricators and manufacturers.
             Based in ${C.city}, supplying across India.</p>
          ${socials.length ? `<div class="footer-social">
            ${socials.map(([k, url]) => `<a href="${url}" target="_blank" rel="noopener" aria-label="${k}">${ICONS[k]}</a>`).join("")}
          </div>` : ""}
        </div>

        <div>
          <h4>Company</h4>
          <nav>
            <a href="about.html">About Us</a>
            <a href="company-profile.html">Company Profile</a>
            <a href="company-profile.html#process">Manufacturing</a>
            <a href="company-profile.html#quality">Quality Assurance</a>
            <a href="certifications.html">Certifications</a>
            <a href="${C.brochure}" download>Download Brochure</a>
          </nav>
        </div>

        <div>
          <h4>Products</h4>
          <nav>
            <a href="products.html#copper">Copper Products</a>
            <a href="products.html#brass">Brass Products</a>
            <a href="specifications.html">Specifications</a>
            <a href="weight-calculator.html">Weight Calculator</a>
            <a href="contact.html">Request a Quote</a>
          </nav>
        </div>

        <div>
          <h4>Reach Us</h4>
          <div class="footer-contact">
            <a href="${telLink(C.phone1)}">${ICONS.phone}<span>${C.phone1}</span></a>
            ${C.phone2 ? `<a href="${telLink(C.phone2)}">${ICONS.phone}<span>${C.phone2}</span></a>` : ""}
            <a href="mailto:${C.email}">${ICONS.mail}<span>${C.email}</span></a>
            <a href="${waLink("Hello Aksa Metals, I would like to know more about your products.")}" target="_blank" rel="noopener">${ICONS.whatsapp}<span>WhatsApp us</span></a>
            <a href="${C.mapsUrl}" target="_blank" rel="noopener">${ICONS.pin}<span>${C.address}</span></a>
          </div>
        </div>

      </div>

      <div class="footer-bottom">
        <span>&copy; ${year} ${C.legalName}, ${C.city}. All rights reserved.</span>
        <span>
          ${C.gstin ? `GSTIN: ${C.gstin}` : ""}
          ${C.gstin && C.udyam ? " &nbsp;·&nbsp; " : ""}
          ${C.udyam ? `Udyam: ${C.udyam}` : ""}
        </span>
      </div>
    </div>
  </footer>

  <a class="float-wa" target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp"
     href="${waLink("Hello Aksa Metals, I have an enquiry.")}">${ICONS.whatsapp}</a>`;
}

/* ----------------------------------------------------- Product card HTML - */
function productCardHTML(p) {
  const thick = p.specs.find((s) => s.label === "Thickness");
  const size  = p.specs.find((s) => s.label === "Diameter" || s.label === "Width");
  return `
  <a class="card product-card reveal tint-${p.metal}" href="product-${p.slug}.html">
    <div class="product-thumb">
      <span class="tag tag-${p.metal}">${p.metal}</span>
      <img src="${p.image}" alt="${p.name}" loading="lazy" width="900" height="675">
    </div>
    <div class="product-body">
      <h3>${p.name}</h3>
      <p>${p.tagline}</p>
      <div class="product-meta">
        ${thick ? `<span><b>Thickness</b> ${thick.value}</span>` : ""}
        ${size  ? `<span><b>${size.label}</b> ${size.value}</span>` : ""}
      </div>
      <span class="link-arrow">View details</span>
    </div>
  </a>`;
}

/* ------------------------------------------------------------- Count-up -- */
function countUp(el) {
  const raw = el.dataset.count;
  const num = parseFloat(raw.replace(/[^\d.]/g, ""));
  if (!isFinite(num) || num === 0) { el.textContent = raw; return; }

  const prefix = raw.slice(0, raw.search(/[\d.]/));
  const suffix = raw.slice(raw.search(/[\d.]/) + String(num).length);
  const decimals = (String(num).split(".")[1] || "").length;
  const duration = 1300;
  let start = null;

  function frame(ts) {
    if (start === null) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = prefix + (num * eased).toFixed(decimals) + suffix;
    if (progress < 1) requestAnimationFrame(frame);
    else el.textContent = raw;
  }
  requestAnimationFrame(frame);
}

/* ----------------------------------------------------------------- Boot -- */
document.addEventListener("DOMContentLoaded", () => {

  /* -- Mount shared layout -- */
  const headerMount = document.getElementById("app-header");
  const footerMount = document.getElementById("app-footer");
  if (headerMount) headerMount.innerHTML = renderHeader();
  if (footerMount) footerMount.innerHTML = renderFooter();

  /* -- Sticky header state -- */
  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      document.body.classList.toggle("scrolled", window.scrollY > 24);
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* -- Mobile drawer -- */
  const burger = document.getElementById("hamburger");
  const scrim  = document.getElementById("navScrim");
  const closeBtn = document.getElementById("drawerClose");

  function setDrawer(open) {
    document.body.classList.toggle("nav-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (burger) burger.setAttribute("aria-expanded", String(open));
  }
  if (burger)   burger.addEventListener("click", () => setDrawer(!document.body.classList.contains("nav-open")));
  if (scrim)    scrim.addEventListener("click", () => setDrawer(false));
  if (closeBtn) closeBtn.addEventListener("click", () => setDrawer(false));

  document.querySelectorAll(".drawer-group > button").forEach((b) =>
    b.addEventListener("click", () => b.parentElement.classList.toggle("open"))
  );
  document.querySelectorAll(".drawer a").forEach((a) =>
    a.addEventListener("click", () => setDrawer(false))
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setDrawer(false);
  });

  /* -- Fill dynamic contact values -- */
  document.querySelectorAll("[data-fill]").forEach((el) => {
    const v = AKSA_CONFIG[el.dataset.fill];
    if (v) el.textContent = v;
  });
  document.querySelectorAll("[data-wa]").forEach((el) => {
    el.href = waLink(el.dataset.wa);
    el.target = "_blank";
    el.rel = "noopener";
  });
  document.querySelectorAll("[data-tel]").forEach((el) => {
    el.href = telLink(el.dataset.tel === "2" ? AKSA_CONFIG.phone2 : AKSA_CONFIG.phone1);
  });
  document.querySelectorAll("[data-brochure]").forEach((el) => {
    el.href = AKSA_CONFIG.brochure;
    el.setAttribute("download", "");
  });

  /* -- Render any product grids on the page -- */
  document.querySelectorAll("[data-product-grid]").forEach((grid) => {
    const filter = grid.dataset.productGrid;
    const list = filter === "all" ? AKSA_PRODUCTS : AKSA_PRODUCTS.filter((p) => p.metal === filter);
    grid.innerHTML = list.map(productCardHTML).join("");
  });

  /* -- Scroll reveal -- */
  document.body.classList.add("js-anim");
  const revealIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("shown");
      revealIO.unobserve(e.target);
    }),
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealIO.observe(el));

  /* -- Animated stat counters -- */
  const statIO = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countUp(e.target);
      statIO.unobserve(e.target);
    }),
    { threshold: 0.5 }
  );
  document.querySelectorAll("[data-count]").forEach((el) => statIO.observe(el));

  /* -- Scroll-spy for the anchored section nav -- */
  const pills = document.querySelectorAll(".pill-nav a[href^='#']");
  if (pills.length) {
    const targets = [...pills]
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);
    const spyIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          pills.forEach((a) =>
            a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
          );
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    targets.forEach((t) => spyIO.observe(t));
  }

  /* -- Broken image fallback: show a metal gradient instead of a broken icon -- */
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener("error", function () {
      const warm = this.closest(".tint-brass") ? "#C9A227, #E8CE7A" : "#8C5623, #D9A066";
      this.style.background = `linear-gradient(140deg, ${warm})`;
      this.removeAttribute("src");
      this.style.minHeight = "180px";
    });
  });
});
