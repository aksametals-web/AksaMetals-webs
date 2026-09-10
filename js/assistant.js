/* ============================================================================
   AKSA METALS — ON-SITE ASSISTANT
   ----------------------------------------------------------------------------
   Answers visitor questions about products, sizes, grades, pricing, delivery
   and contact details.

   TWO MODES
   ---------
   1. BUILT-IN BRAIN (what runs today)
      Everything below runs in the visitor's browser. No API key, no server,
      no cost, works with a bad connection. It reads real numbers out of
      js/products-data.js, so its answers stay correct when you update specs.

   2. OPEN-SOURCE MODEL (round two)
      Set LLM.enabled = true and point LLM.endpoint at your proxy.

      ⚠ SECURITY — READ THIS BEFORE GOING LIVE
      Never put a real API key in this file. Anything here is visible to every
      visitor through View Source, and a stolen key gets used until your credit
      runs out. The endpoint below must be YOUR OWN serverless function
      (Netlify Functions / Cloudflare Workers — both free) which holds the key
      server-side and forwards the request. Roughly 40 lines of code; ask and
      it will be written for you.
   ============================================================================ */

const LLM = {
  enabled: false,                 // ← flip to true once your proxy is live
  endpoint: "",                   // ← YOUR proxy URL, never a provider URL with a key
  model: "llama-3.3-70b-versatile",
  maxTokens: 320,
  get systemPrompt() {
    const C = AKSA_CONFIG;
    return [
      `You are the assistant for ${C.name}, a copper and brass manufacturer in ${C.city}.`,
      `Answer briefly (2-4 sentences), warmly, and only about this business.`,
      `Products: ${AKSA_PRODUCTS.map((p) => p.name).join(", ")}.`,
      `Contact: ${C.phone1}, ${C.email}. Hours: ${C.hours}. Address: ${C.address}.`,
      `Never invent prices — metal rates move daily, so direct pricing questions to WhatsApp or phone.`,
      `If you do not know something, say so and offer to connect them with the sales team.`,
    ].join(" ");
  },
};

/* ========================================================================== *
   LANGUAGE HELPERS
 * ========================================================================== */

/* Words Indian B2B buyers actually type, mapped to the terms we match on.
   Includes common Hindi/Urdu transliterations seen in trade enquiries.      */
const SYNONYMS = {
  rate: "price", bhav: "price", daam: "price", cost: "price", pricing: "price",
  quotation: "quote", quotes: "quote", enquiry: "quote", inquiry: "quote",
  kitna: "how much", kitne: "how much",
  patra: "sheet", chadar: "sheet", chaddar: "sheet", plates: "plate",
  sheets: "sheet", strips: "strip", coils: "coil", circles: "circle",
  foils: "foil", discs: "circle", disc: "circle", round: "circle", gol: "circle",
  rolls: "coil", roll: "coil",
  vajan: "weight", wajan: "weight", kg: "weight", kilo: "weight",
  kahan: "where", jagah: "location", pata: "address",
  peetal: "brass", pital: "brass", brass: "brass",
  tamba: "copper", tamra: "copper", copper: "copper",
  moq: "minimum order", minimum: "minimum order",
  delivery: "delivery", shipping: "delivery", dispatch: "delivery",
  lead: "delivery", transport: "delivery",
  certificate: "certification", certificates: "certification", iso: "certification",
  mtc: "certification", isi: "certification",
  thickness: "thickness", gauge: "thickness", thick: "thickness",
  width: "width", size: "size", dimension: "size", dimensions: "size",
  grade: "grade", grades: "grade", alloy: "grade", alloys: "grade",
  temper: "temper", hardness: "temper",
  contact: "contact", number: "contact", call: "contact", phone: "contact",
  whatsapp: "contact", email: "contact", mail: "contact",
  buy: "order", purchase: "order", ordering: "order",
  sample: "sample", samples: "sample", trial: "sample",
  payment: "payment", terms: "payment", credit: "payment", advance: "payment",
  export: "export", exports: "export", international: "export",
  hi: "hello", hey: "hello", hii: "hello", hlo: "hello", namaste: "hello",
  namaskar: "hello", thanks: "thank", thankyou: "thank", ty: "thank",
};

function normalise(text) {
  const words = String(text)
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => SYNONYMS[w] || w);
  return " " + words.join(" ") + " ";
}

/* ========================================================================== *
   PRODUCT DETECTION
 * ========================================================================== */

const FAMILIES = ["circle", "coil", "sheet", "strip", "plate", "foil"];

function detectProduct(q) {
  const metal  = /\bcopper\b/.test(q) ? "copper" : /\bbrass\b/.test(q) ? "brass" : null;
  const family = FAMILIES.find((f) => new RegExp("\\b" + f + "\\b").test(q)) || null;

  if (metal && family) {
    return AKSA_PRODUCTS.find((p) => p.metal === metal && p.family.toLowerCase() === family) || null;
  }
  return null;
}

function productAnswer(p) {
  const spec = (label) => {
    const hit = p.specs.find((s) => s.label === label);
    return hit ? hit.value : null;
  };
  const size = spec("Diameter") || spec("Width");

  const lines = [
    `${p.name} — ${p.tagline}`,
    "",
    `• Thickness: ${spec("Thickness")}`,
    size ? `• ${spec("Diameter") ? "Diameter" : "Width"}: ${size}` : "",
    `• Grades: ${p.grades.join(", ")}`,
    `• Tempers: ${p.tempers.join(", ")}`,
    `• Standards: ${p.standards.join(", ")}`,
    "",
    `Commonly used for ${p.applications.slice(0, 3).join(", ").toLowerCase()}.`,
  ].filter((l) => l !== "");

  return {
    text: lines.join("\n"),
    actions: [
      { label: "Full details", href: `product-${p.slug}.html` },
      { label: "Get a quote", href: "contact.html" },
      { label: "Weight calculator", href: "weight-calculator.html" },
    ],
    chips: ["What is your minimum order?", "How long is delivery?", "Do you give test certificates?"],
  };
}

function metalRangeAnswer(metal) {
  const list = AKSA_PRODUCTS.filter((p) => p.metal === metal);
  const label = metal === "copper" ? "Copper" : "Brass";
  return {
    text:
      `We roll ${label.toLowerCase()} into six forms:\n\n` +
      list.map((p) => `• ${p.name} — ${p.tagline.replace(/\.$/, "")}`).join("\n") +
      `\n\nTell me which one you need and I'll give you the sizes and grades.`,
    actions: [
      { label: `All ${label.toLowerCase()} products`, href: `products.html#${metal}` },
      { label: "Get a quote", href: "contact.html" },
    ],
    chips: list.slice(0, 3).map((p) => `Tell me about ${p.name.toLowerCase()}`),
  };
}

/* ========================================================================== *
   INTENTS
   Each entry: keys to match, and a reply builder.

   Longer keys score higher, so "minimum order" beats a stray "order".

   `boost` is for intents whose keywords are unmistakable. "custom" or
   "industries" can only mean one thing, whereas a generic word like "size"
   or "supply" turns up everywhere — without the boost those two would tie
   and the winner would just be whichever appears first in this list.
 * ========================================================================== */

const INTENTS = [
  {
    id: "hello",
    keys: ["hello", "good morning", "good afternoon", "good evening", "anyone there"],
    reply: () => ({
      text:
        "Hello! I'm the Aksa Metals assistant. 👋\n\n" +
        "I can help with our copper and brass range, sizes and grades, weight calculations, " +
        "delivery times, or putting you in touch with the sales team.\n\nWhat are you looking for?",
      chips: ["What products do you make?", "How do I get a price?", "Where are you located?"],
    }),
  },
  {
    id: "products",
    keys: ["what do you make", "what do you sell", "product", "products", "range",
           "catalogue", "catalog", "manufacture", "supply", "items"],
    reply: () => ({
      text:
        "We manufacture precision-rolled copper and brass in six forms each:\n\n" +
        "• Circles — for pressing, spinning and deep drawing\n" +
        "• Coils — continuous feed for stamping lines\n" +
        "• Sheets — flat, levelled, cut to your length\n" +
        "• Strips — precision-slit to narrow widths\n" +
        "• Plates — heavy gauge for busbars and machining\n" +
        "• Foils — down to 18 microns\n\n" +
        "Which metal are you interested in — copper or brass?",
      actions: [{ label: "See all 12 products", href: "products.html" }],
      chips: ["Tell me about copper", "Tell me about brass", "What sizes do you offer?"],
    }),
  },
  {
    id: "price",
    keys: ["price", "how much", "quote", "budget", "cheap", "expensive", "per kg", "per kilo"],
    reply: () => ({
      text:
        "Copper and brass are priced against the day's LME metal rate, so a quote given today " +
        "would be wrong next week — which is why we don't publish a price list.\n\n" +
        "Send us the metal, form, dimensions and quantity and you'll have a firm quote back, " +
        "usually within a few hours during working hours.",
      actions: [
        { label: "Request a quote", href: "contact.html" },
        { label: "WhatsApp us", href: waLink("Hello Aksa Metals, I would like a quote for:\n\nProduct: \nSize: \nQuantity: ") },
      ],
      chips: ["What is your minimum order?", "Do you offer credit terms?", "How long is delivery?"],
    }),
  },
  {
    id: "weight",
    keys: ["weight", "calculator", "calculate", "density", "how heavy", "kg per"],
    reply: () => ({
      text:
        "Our weight calculator works out the exact weight of any circle, sheet, strip, rod, tube or wire — " +
        "pick the alloy, enter the dimensions, and it does the arithmetic.\n\n" +
        "For reference: copper is 8.96 g/cm³ and brass runs between 8.39 and 8.53 g/cm³ depending on the alloy.",
      actions: [{ label: "Open weight calculator", href: "weight-calculator.html" }],
      chips: ["What grades do you offer?", "How do I get a price?"],
    }),
  },
  {
    id: "specs",
    keys: ["specification", "spec", "thickness", "width", "size", "tolerance",
           "temper", "grade", "standard", "astm", "technical"],
    reply: () => ({
      text:
        "Broadly, across the range:\n\n" +
        "• Thickness: 0.018 mm (foil) up to 50 mm (plate)\n" +
        "• Width: up to 1000 mm; strips slit from 5 mm\n" +
        "• Circles: 40 mm to 1000 mm diameter\n" +
        "• Copper grades: C11000 ETP, C10200 OF, C12200 DHP\n" +
        "• Brass grades: CuZn30 (70/30), CuZn37 (63/37), CuZn40, naval and lead-free\n" +
        "• Standards: IS 410, IS 1897, IS 4413, ASTM B152, ASTM B36, BS EN 1652\n\n" +
        "Which product should I give exact figures for?",
      actions: [{ label: "Full specification tables", href: "specifications.html" }],
      chips: ["Tell me about copper circles", "Tell me about brass strips", "Can you do custom sizes?"],
    }),
  },
  {
    id: "custom",
    boost: 3,
    keys: ["custom", "custom size", "custom width", "special size", "made to order",
           "bespoke", "non standard", "different size", "odd size"],
    reply: () => ({
      text:
        "Yes — most of what we roll is made to order rather than pulled off a shelf. " +
        "Custom widths, thicknesses, diameters and tempers are all normal for us.\n\n" +
        "Send the dimensions, or a drawing if you have one, and we'll confirm whether it's " +
        "within range and what it would cost.",
      actions: [
        { label: "Send your requirement", href: "contact.html" },
        { label: "WhatsApp us", href: waLink("Hello Aksa Metals, I need a custom size:\n\n") },
      ],
      chips: ["What is your minimum order?", "How long is delivery?"],
    }),
  },
  {
    id: "certification",
    keys: ["certification", "quality", "test report", "mill test", "traceability", "audit"],
    reply: () => ({
      text:
        "Every batch ships with a mill test certificate covering chemical composition and " +
        "mechanical properties, so the material is traceable back to its heat number.\n\n" +
        "We work to ISO 9001:2015-aligned procedures and the formal certification is in progress — " +
        "we'd rather tell you that plainly than claim a certificate we don't hold yet.",
      actions: [{ label: "Certifications & standards", href: "certifications.html" }],
      chips: ["What standards do you follow?", "Can I visit the plant?"],
    }),
  },
  {
    id: "location",
    keys: ["where", "location", "address", "bidar", "factory", "plant", "visit", "come to"],
    reply: () => ({
      text:
        `We're in ${AKSA_CONFIG.city} — ${AKSA_CONFIG.address}.\n\n` +
        `Visitors are welcome; it's worth calling ahead so someone is free to show you around. ` +
        `Working hours are ${AKSA_CONFIG.hours}.`,
      actions: [
        { label: "Open in Maps", href: AKSA_CONFIG.mapsUrl },
        { label: "Contact page", href: "contact.html" },
      ],
      chips: ["What are your phone numbers?", "Do you deliver across India?"],
    }),
  },
  {
    id: "contact",
    keys: ["contact", "talk to someone", "speak to", "sales team", "reach you", "get in touch"],
    reply: () => ({
      text:
        `Here's how to reach us:\n\n` +
        `📞 ${AKSA_CONFIG.phone1}\n` +
        (AKSA_CONFIG.phone2 ? `📞 ${AKSA_CONFIG.phone2}\n` : "") +
        `✉️ ${AKSA_CONFIG.email}\n\n` +
        `WhatsApp is usually fastest — the green button at the bottom-left of the page. ` +
        `Hours: ${AKSA_CONFIG.hours}.`,
      actions: [
        { label: "WhatsApp us", href: waLink("Hello Aksa Metals, I have an enquiry.") },
        { label: "Call now", href: telLink(AKSA_CONFIG.phone1) },
      ],
      chips: ["Where are you located?", "How do I get a price?"],
    }),
  },
  {
    id: "brochure",
    keys: ["brochure", "download", "pdf", "company profile document", "catalogue pdf"],
    reply: () => ({
      text:
        "You can download our brochure from the button in the top menu — it covers the full " +
        "product range, dimensions and capabilities in one PDF you can forward internally.",
      actions: [
        { label: "Download brochure", href: AKSA_CONFIG.brochure },
        { label: "Company profile", href: "company-profile.html" },
      ],
      chips: ["What products do you make?", "Where are you located?"],
    }),
  },
  {
    id: "about",
    keys: ["about", "company", "who are you", "history", "founder", "established",
           "how old", "experience", "background"],
    reply: () => ({
      text:
        `${AKSA_CONFIG.name} is a copper and brass manufacturer based in ${AKSA_CONFIG.city}, ` +
        `supplying vendors, fabricators and OEMs across India.\n\n` +
        `We started in ${AKSA_CONFIG.founded}, so we're new — and we'd rather say so than pretend ` +
        `otherwise. What we can offer is close attention to every order, honest quoting, and a test ` +
        `certificate with every dispatch.`,
      actions: [
        { label: "Our story", href: "about.html" },
        { label: "Company profile", href: "company-profile.html" },
      ],
      chips: ["Why should I buy from a new company?", "Can I visit the plant?", "Do you give test certificates?"],
    }),
  },
  {
    id: "why-new",
    keys: ["why should i", "new company", "trust", "why you", "why buy", "reliable",
           "how do i know", "competitors"],
    reply: () => ({
      text:
        "Fair question, and one worth asking.\n\n" +
        "Being new means we can't point at thirty years of history. What it does mean is that " +
        "your order is not batch number four hundred on a busy line — it gets real attention.\n\n" +
        "Practically: every batch carries a mill test certificate, we quote against the day's " +
        "actual metal rate rather than padding, and we'd rather turn down an order we can't hit " +
        "on time than miss the date. Start with a trial quantity and judge us on that.",
      actions: [
        { label: "Request a trial order", href: "contact.html" },
        { label: "Our story", href: "about.html" },
      ],
      chips: ["What is your minimum order?", "Do you give test certificates?"],
    }),
  },
  {
    id: "delivery",
    keys: ["delivery", "how long", "lead time", "when can you", "urgent", "fast",
           "logistics", "courier", "freight"],
    reply: () => ({
      text:
        "Typical dispatch is 3 to 10 working days, depending on the form, size and quantity — " +
        "standard sizes move fastest, custom widths need rolling and slitting time.\n\n" +
        "We ship across India through transport partners. If you have a hard deadline, say so " +
        "when you enquire and we'll tell you honestly whether we can hit it.",
      actions: [{ label: "Check on your order", href: "contact.html" }],
      chips: ["What is your minimum order?", "Do you export?", "How do I get a price?"],
    }),
  },
  {
    id: "moq",
    keys: ["minimum order", "small quantity", "trial order", "sample", "one piece", "bulk"],
    reply: () => ({
      text:
        "For standard sizes the minimum is usually around 50–100 kg. Custom widths or unusual " +
        "tempers need more, because the mill has to be set up for the run.\n\n" +
        "If you're testing us out, ask about a trial quantity — we'd rather start small and earn " +
        "the repeat order.",
      actions: [
        { label: "Ask about a trial order", href: waLink("Hello Aksa Metals, I'd like to ask about a trial quantity of:\n\n") },
      ],
      chips: ["How long is delivery?", "Do you offer credit terms?"],
    }),
  },
  {
    id: "payment",
    keys: ["payment", "credit", "advance", "gst", "invoice", "billing", "terms"],
    reply: () => ({
      text:
        "First orders are normally against advance payment; regular customers can discuss credit " +
        "terms once a working relationship is established. All dispatches are on a proper GST invoice.\n\n" +
        "Our sales team can confirm the exact terms for your order.",
      actions: [{ label: "Discuss terms", href: "contact.html" }],
      chips: ["What is your minimum order?", "How long is delivery?"],
    }),
  },
  {
    id: "export",
    keys: ["export", "international", "overseas", "outside india", "abroad", "shipping worldwide"],
    reply: () => ({
      text:
        "Our focus right now is supplying customers across India properly before taking on export " +
        "commitments we can't service well.\n\n" +
        "That said, if you have an export requirement, talk to us — we'll tell you straight whether " +
        "we can handle it.",
      actions: [{ label: "Talk to sales", href: "contact.html" }],
      chips: ["Do you deliver across India?", "What is your minimum order?"],
    }),
  },
  {
    id: "industries",
    boost: 3,
    keys: ["industry", "industries", "who buys", "applications", "used for",
           "sectors", "customers", "which industries"],
    reply: () => ({
      text:
        "Our material goes into:\n\n" +
        AKSA_CONFIG.industries.map((i) => "• " + i).join("\n") +
        "\n\nIf your application isn't listed, ask anyway — copper and brass turn up in more places than most lists cover.",
      actions: [{ label: "See our products", href: "products.html" }],
      chips: ["Tell me about copper circles", "Tell me about brass sheets"],
    }),
  },
  {
    id: "thank",
    keys: ["thank", "great", "perfect", "helpful", "awesome", "nice one"],
    reply: () => ({
      text:
        "Happy to help. If anything else comes up, I'm right here — and for anything I can't answer, " +
        "the sales team is on WhatsApp and usually replies quickly. 🙏",
      chips: ["How do I get a price?", "What products do you make?"],
    }),
  },
  {
    id: "bye",
    keys: ["bye", "goodbye", "see you", "that is all", "no thanks"],
    reply: () => ({
      text: "Thanks for visiting Aksa Metals. Hope we get the chance to work with you soon. 🙏",
      chips: ["Actually, one more thing…"],
    }),
  },
];

/* ========================================================================== *
   MATCHING
 * ========================================================================== */

const MIN_SCORE = 3;

function fallback(userText) {
  return {
    text:
      "I'm not confident I'd get that right, and a wrong answer about metal costs you money — " +
      "so let me pass you to someone who knows.\n\n" +
      "The sales team answers WhatsApp quickly during working hours and can deal with anything " +
      "technical or commercial.\n\n" +
      "In the meantime I'm good on: products, sizes and grades, weight calculations, delivery " +
      "times, minimum orders and how to get a quote.",
    actions: [
      { label: "Ask the team on WhatsApp", href: waLink("Hello Aksa Metals, I have a question: " + userText) },
      { label: "Call " + AKSA_CONFIG.phone1, href: telLink(AKSA_CONFIG.phone1) },
    ],
    chips: ["What products do you make?", "How do I get a price?", "Where are you located?"],
  };
}

function answer(userText) {
  const q = normalise(userText);

  /* 1 — a specific product beats everything else */
  const product = detectProduct(q);
  if (product) return productAnswer(product);

  /* 2 — score the intents */
  let best = null;
  let bestScore = 0;
  for (const intent of INTENTS) {
    let score = 0;
    for (const key of intent.keys) {
      if (q.includes(" " + key + " ") || q.includes(" " + key)) {
        score += key.split(" ").length * 2 + 1;
      }
    }
    /* Only applied once something matched, so a boost cannot conjure a hit
       out of nothing. */
    if (score > 0) score += intent.boost || 0;
    if (score > bestScore) { bestScore = score; best = intent; }
  }

  /* 3 — a bare metal mention, if nothing scored better */
  if (bestScore < MIN_SCORE) {
    if (/\bcopper\b/.test(q)) return metalRangeAnswer("copper");
    if (/\bbrass\b/.test(q))  return metalRangeAnswer("brass");
  }

  if (best && bestScore >= MIN_SCORE) return best.reply();
  return fallback(userText);
}

/* ---- Optional: hand off to an open-source model through your proxy ------- */
async function llmAnswer(text, history) {
  const res = await fetch(LLM.endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LLM.model,
      max_tokens: LLM.maxTokens,
      messages: [
        { role: "system", content: LLM.systemPrompt },
        ...history,
        { role: "user", content: text },
      ],
    }),
  });
  if (!res.ok) throw new Error("Assistant proxy returned " + res.status);
  const data = await res.json();
  const reply = data.choices && data.choices[0] && data.choices[0].message.content;
  if (!reply) throw new Error("Empty reply from assistant proxy");
  return { text: reply, chips: ["How do I get a price?", "What products do you make?"] };
}

/* ========================================================================== *
   WIDGET
 * ========================================================================== */

const DEFAULT_CHIPS = [
  "What products do you make?",
  "How do I get a price?",
  "What sizes do you offer?",
  "Where are you located?",
];

const chatHistory = [];

function chatWidgetHTML() {
  return `
  <button class="chat-fab" id="chatFab" aria-label="Ask the Aksa Metals assistant">
    ${ICONS.spark}
    <span class="chat-badge" id="chatBadge">1</span>
  </button>

  <div class="chat-panel" id="chatPanel" role="dialog" aria-label="Aksa Metals assistant" aria-modal="false">
    <div class="chat-head">
      <div class="chat-avatar">A</div>
      <div class="chat-head-text">
        <b>Aksa Assistant</b>
        <small><span class="chat-dot"></span> Online — replies instantly</small>
      </div>
      <button class="chat-close" id="chatClose" aria-label="Close assistant">&times;</button>
    </div>

    <div class="chat-body" id="chatBody" role="log" aria-live="polite"></div>

    <div class="chat-chips" id="chatChips"></div>

    <div class="chat-input">
      <input id="chatText" type="text" placeholder="Ask about products, sizes, prices…"
             autocomplete="off" aria-label="Your message" />
      <button id="chatSend" aria-label="Send message">${ICONS.send}</button>
    </div>
    <div class="chat-foot">Automated assistant · for firm prices please contact our sales team</div>
  </div>`;
}

function addMessage(reply, who) {
  const body = document.getElementById("chatBody");
  const div = document.createElement("div");
  div.className = "msg msg-" + who;

  if (typeof reply === "string") {
    div.textContent = reply;
  } else {
    div.textContent = reply.text;
    if (reply.actions && reply.actions.length) {
      const actions = document.createElement("div");
      actions.className = "msg-actions";
      reply.actions.forEach((a) => {
        const link = document.createElement("a");
        link.href = a.href;
        link.textContent = a.label;
        if (/^https?:|^tel:/.test(a.href)) { link.target = "_blank"; link.rel = "noopener"; }
        actions.appendChild(link);
      });
      div.appendChild(actions);
    }
  }

  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function setChips(list) {
  const wrap = document.getElementById("chatChips");
  wrap.innerHTML = (list && list.length ? list : DEFAULT_CHIPS)
    .map((q) => `<button type="button">${q}</button>`)
    .join("");
  wrap.querySelectorAll("button").forEach((b) =>
    b.addEventListener("click", () => handleUserMessage(b.textContent))
  );
}

function showTyping() {
  const body = document.getElementById("chatBody");
  const div = document.createElement("div");
  div.className = "msg msg-bot";
  div.id = "typingMsg";
  div.innerHTML = '<span class="typing"><i></i><i></i><i></i></span>';
  body.appendChild(div);
  body.scrollTop = body.scrollHeight;
}

function hideTyping() {
  const t = document.getElementById("typingMsg");
  if (t) t.remove();
}

let busy = false;

async function handleUserMessage(text) {
  text = String(text || "").trim();
  if (!text || busy) return;
  busy = true;

  const input = document.getElementById("chatText");
  const send  = document.getElementById("chatSend");
  input.value = "";
  send.disabled = true;

  addMessage(text, "user");
  chatHistory.push({ role: "user", content: text });
  showTyping();

  let reply;
  try {
    if (LLM.enabled && LLM.endpoint) {
      reply = await llmAnswer(text, chatHistory.slice(-8));
    } else {
      reply = answer(text);
      /* A human pause proportional to how much there is to read. */
      const think = 420 + Math.min(reply.text.length * 3.2, 1150);
      await new Promise((r) => setTimeout(r, think));
    }
  } catch (err) {
    reply = fallback(text);
  }

  hideTyping();
  addMessage(reply, "bot");
  setChips(reply.chips);
  chatHistory.push({ role: "assistant", content: reply.text });

  send.disabled = false;
  busy = false;
  input.focus();
}

/* ----------------------------------------------------------------- Boot -- */
document.addEventListener("DOMContentLoaded", () => {
  const mount = document.createElement("div");
  mount.innerHTML = chatWidgetHTML();
  document.body.appendChild(mount);

  const panel = document.getElementById("chatPanel");
  const fab   = document.getElementById("chatFab");
  const badge = document.getElementById("chatBadge");
  let greeted = false;

  function openChat() {
    panel.classList.add("open");
    document.body.classList.add("chat-open");
    if (badge) badge.style.display = "none";

    if (!greeted) {
      greeted = true;
      setChips(DEFAULT_CHIPS);
      showTyping();
      setTimeout(() => {
        hideTyping();
        addMessage(
          {
            text:
              "Hello! 👋 I'm the Aksa Metals assistant.\n\n" +
              "Ask me about our copper and brass range, sizes and grades, weight calculations, " +
              "or how to get a quote — or tap one of the questions below.",
          },
          "bot"
        );
      }, 620);
    }
    setTimeout(() => {
      const input = document.getElementById("chatText");
      if (input && window.innerWidth > 640) input.focus();
    }, 340);
  }

  function closeChat() {
    panel.classList.remove("open");
    document.body.classList.remove("chat-open");
  }

  fab.addEventListener("click", openChat);
  document.getElementById("chatClose").addEventListener("click", closeChat);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closeChat();
  });

  document.getElementById("chatSend").addEventListener("click", () =>
    handleUserMessage(document.getElementById("chatText").value)
  );
  document.getElementById("chatText").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleUserMessage(e.target.value);
  });

  /* Let any button on the page open the assistant: <button data-open-chat> */
  document.querySelectorAll("[data-open-chat]").forEach((el) =>
    el.addEventListener("click", (e) => { e.preventDefault(); openChat(); })
  );
});
