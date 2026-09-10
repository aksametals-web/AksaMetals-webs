# Aksa Metals — Website Prototype

A fast, minimal, copper-and-brass themed B2B website for **Aksa Metals, Bidar** — inspired by meicopper.com.

## How to view it

Just double-click `index.html` — it opens in any browser. No installation needed.
(In VS Code, you can also use the "Live Server" extension for auto-reload while editing.)

## Pages

| File | Page |
|---|---|
| `index.html` | Home |
| `about.html` | About Us (Apple-minimal story page) |
| `company-profile.html` | Company Profile — infrastructure, process, quality, why us |
| `certifications.html` | Certifications & standards |
| `products.html` | Copper & Brass product range |
| `specifications.html` | Technical spec tables |
| `weight-calculator.html` | Working metal weight calculator |
| `contact.html` | Get a Quote (WhatsApp redirect) + contact cards |

## Where to change things

- **Contact details, address, WhatsApp number, email** → edit `AKSA_CONFIG` at the top of `js/main.js`. One edit updates the whole site.
- **Colors & fonts** → CSS variables at the top of `css/style.css`.
- **AI assistant answers** → the `KB` list in `js/assistant.js`. Round 2: set `LLM.enabled = true` and add an open-source model endpoint (Groq/Ollama) — the hook is already built.
- **Brochure** → replace `assets/brochure.pdf` with your real brochure (keep the same filename).
- Anything marked **placeholder** in the pages is waiting for your real data.

## Notes

- Quote form opens WhatsApp/email on the visitor's device — no backend needed, nothing stored.
- The site is fully static: host it free on Netlify/GitHub Pages, or any hosting like Hostinger.
