/* ============================================================================
   AKSA METALS — SITE SETTINGS
   ============================================================================

   ★ THIS IS THE ONLY FILE YOU NEED TO EDIT ★

   Change a value between the quote marks below and it updates EVERYWHERE on
   the website — every page, the menu, the footer, the WhatsApp buttons, the
   assistant's answers, all of it.

   Rules:
     • Only change the text INSIDE the "quote marks".
     • Keep the comma at the end of each line.
     • Save the file, then refresh the website in your browser.

   Anything marked  <<< REPLACE  is fake sample data and must be changed
   before the website goes live.
   ============================================================================ */

const AKSA_CONFIG = {

  /* ---- Company identity ------------------------------------------------ */
  name:      "Aksa Metals",
  legalName: "Aksa Metals",                   // <<< REPLACE with the registered name
  tagline:   "Copper & Brass Manufacturing",
  city:      "Bidar, Karnataka",
  founded:   "2026",

  /* ---- Where you are --------------------------------------------------- */
  address:  "Plot No. 12, Industrial Area, Naubad, Bidar, Karnataka 585402",  // <<< REPLACE
  mapsUrl:  "https://www.google.com/maps/search/?api=1&query=Bidar+Karnataka", // <<< REPLACE with your pin

  /* ---- How buyers reach you -------------------------------------------- */
  phone1:   "+91 98765 43210",     // <<< REPLACE — main sales line
  phone2:   "+91 98765 43211",     // <<< REPLACE — second line (leave "" to hide it)
  whatsapp: "919876543210",        // <<< REPLACE — same number as phone1, but DIGITS ONLY:
                                   //     country code first, no +, no spaces.
                                   //     "+91 98765 43210"  becomes  "919876543210"
  email:    "sales@aksametals.com",// <<< REPLACE
  hours:    "Mon – Sat · 9:00 AM – 6:30 PM",

  /* ---- Registration numbers -------------------------------------------- */
  gstin: "29XXXXX0000X1Z5",        // <<< REPLACE (leave "" to hide it)
  udyam: "UDYAM-KR-00-0000000",    // <<< REPLACE (leave "" to hide it)

  /* ---- Files ----------------------------------------------------------- */
  brochure: "assets/brochure.pdf", // drop your real PDF at this path, same filename

  /* ---- Social links (leave "" to hide the icon) ------------------------- */
  facebook:  "",
  linkedin:  "",
  instagram: "",

  /* ---- Numbers shown on the home page ----------------------------------
     A brand-new company should NOT claim decades of experience or huge
     tonnage — buyers check. These are deliberately honest for a 2026 start.
     Update them as the business grows.                                      */
  stats: [
    { value: "100%",  label: "Batches quality-tested"   },
    { value: "12",    label: "Product variants"         },
    { value: "24 hr", label: "Quote turnaround"         },
    { value: "3–10",  label: "Day dispatch window"      },
  ],

  /* ---- Industries you supply ------------------------------------------- */
  industries: [
    "Electrical & Switchgear",
    "Utensils & Cookware",
    "Hardware & Fittings",
    "Automotive Components",
    "Handicrafts & Artware",
    "Engineering & Fabrication",
    "Plumbing & Sanitary",
    "Defence & Ammunition",
  ],
};

/* ---- Helper used by every WhatsApp button on the site -------------------- */
function waLink(message) {
  return "https://wa.me/" + AKSA_CONFIG.whatsapp +
         "?text=" + encodeURIComponent(message || "Hello Aksa Metals, I have an enquiry.");
}

/* ---- Helper: phone number stripped down for tel: links ------------------- */
function telLink(num) {
  return "tel:" + String(num || AKSA_CONFIG.phone1).replace(/[^\d+]/g, "");
}
