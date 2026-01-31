# AI Editor Rules & Guardrails

This document defines **non-negotiable rules, architectural preferences, and behavioral expectations** for the AI editor. The actual *prompt* given to the AI editor should focus **only on application-specific instructions**, while this document is treated as a standing reference.

---

## 1. Core Philosophy

* Optimize for **practical correctness over theoretical perfection**.
* Assume **AI output is probabilistic and fallible**; user editability is mandatory everywhere.
* Prefer **clear, boring, maintainable solutions** over clever or trendy ones.
* Bias toward **Cloudflare-native tooling** when reasonable.
* Do not ask for permission to execute standard development actions; proceed directly.

---

## 2. AI Usage Rules

* **Use Cloudflare Workers AI models exclusively**:

  * Reference models only from: [https://developers.cloudflare.com/workers-ai/models/](https://developers.cloudflare.com/workers-ai/models/)
  * Do **not** use OpenAI, Anthropic, Google, or other third-party AI APIs.

* AI responsibilities:

  * Image analysis for food identification and portion estimation
  * Initial macro and nutrition estimation

* AI limitations must be assumed:

  * All AI-generated food labels, portions, and nutrition values must be **editable post-save**.
  * Never treat AI output as authoritative or immutable.

* AI output should:

  * Include **confidence ranges or uncertainty flags** when possible
  * Prefer transparency over confidence ("estimated", "approximate")

---

## 3. Platform & App Constraints

* Target platform: **iOS mobile app**
* Expo app - TypeScript

* Primary interaction:

  * Take photo of meal → AI assessment → editable entry → saved log

* App must support:

  * Multiple meals per day
  * Historical browsing and editing

---

## 4. Nutrition & Tracking Rules

* Food entries must support:

  * Meal title (editable)
  * Food description (editable)
  * Ingredient list (editable)
  * Portion sizes (editable)
  * Macronutrients (editable)

* Tracking requirements:

  * Daily macro totals:

    * Per meal
    * Full-day aggregate
  * Weekly macro totals

* Macronutrients should minimally include:

  * Calories
  * Protein
  * Carbohydrates
  * Fat

* Data should be stored in **normalized, query-friendly structures**.

---

## 5. Data & Backend Rules

* Use a **SQL-based backend** (SQLite, PostgreSQL, or equivalent).

* Backend should be:

  * Deployable to Cloudflare-compatible infrastructure when possible
  * Designed with future migration in mind (no vendor lock-in schemas)

* Data rules:

  * No hard deletes by default; prefer soft deletes for user entries
  * All AI-generated values must be traceable as "AI-derived"

---

## 6. Styling & UI Rules

* **Do NOT use Tailwind CSS**.

* Use:

  * Modern, standards-based CSS
  * Native layout systems (Flexbox, Grid)

* UI priorities:

  * Mobile-first
  * Clear editing affordances
  * Minimal visual clutter

---

## 7. Developer Experience Rules

* Do not prompt the user with setup questions like:

  * "Do you want to run npm install?"
  * "Should I create this file?"

* Instead:

  * Assume approval
  * Proceed with reasonable defaults

* When making decisions:

  * Explain *what was done* and *why*, briefly
  * Avoid over-explaining basics

---

## 8. Code Quality Expectations

* Prefer:

  * Explicitness over abstraction
  * Readable naming over brevity

* Avoid:

  * Over-engineered patterns
  * Premature optimization

* Code should be:

  * Modular
  * Testable
  * Structured for future feature expansion (e.g., barcode scanning, manual entry)

---

## 9. Assumptions the AI Editor May Safely Make

* The user:

  * Understands technical trade-offs
  * Is comfortable editing values manually
  * Prefers control over automation

* Reasonable defaults are always better than blocking questions.

---

## 10. When in Doubt

If a decision is unclear:

1. Choose the **simpler** solution
2. Make it **reversible**
3. Document the assumption briefly
4. Move forward

## 11. Gitflow

Periodically add, commit, and push with meaningful commit messages. Don't wait for me to tell you to do that.

---

**This document is authoritative.**
The application-specific prompt should assume these rules without restating them.
