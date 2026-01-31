---
applyTo: '**'
---
# Copilot Custom Instructions

These instructions define **how GitHub Copilot should behave for this repository**. They are authoritative and should be applied implicitly to all suggestions, code generation, and refactors.

---

## General Behavior

* Do not ask for permission to perform standard development actions (e.g., running installs, creating files, scaffolding code).
* Prefer practical, maintainable solutions over clever or trendy ones.
* Optimize for clarity, correctness, and reversibility.
* Assume the user is technical and comfortable editing code and data.
* When uncertain, choose the simplest reasonable approach and move forward.
* Use the GitHub MCP tool to automatically add, commit, and push changes when appropriate. Do not wait for user confirmation unless the change is complex or risky.

---

## AI & ML Usage Rules

* Use **Cloudflare Workers AI models exclusively**.

* Reference models only from:
  [https://developers.cloudflare.com/workers-ai/models/](https://developers.cloudflare.com/workers-ai/models/)

* Do not suggest or use OpenAI, Anthropic, Google, or other third-party AI APIs.

* Assume AI output is probabilistic and fallible:

  * All AI-generated values must be editable by the user.
  * Never treat AI-derived data as authoritative.
  * Prefer language like "estimated" or "approximate" when describing AI results.

---

## Application Context Assumptions

* Target platform: **iOS mobile app**
* Core flow: take meal photo → AI assessment → editable entry → saved log
* Multiple meals per day and historical browsing/editing are required.

---

## Nutrition & Data Rules

* Food entries must support editing of:

  * Entry title
  * Food description
  * Ingredients
  * Portion sizes
  * Macronutrients

* Track and compute:

  * Macronutrient totals per meal
  * Daily totals
  * Weekly totals

* Macronutrients must minimally include:

  * Calories
  * Protein
  * Carbohydrates
  * Fat

---

## Backend & Persistence

* Use a **SQL-based database** (e.g., SQLite or PostgreSQL).

* Design schemas to be:

  * Normalized
  * Query-friendly
  * Portable (avoid vendor lock-in)

* Prefer soft deletes for user data.

* Clearly distinguish AI-derived values from user-edited values in data models.

---

## Frontend & Styling

* Do **not** use Tailwind CSS.
* Use modern, standards-based CSS only.
* Prefer Flexbox and Grid.
* Mobile-first layout and interaction design.
* UI should prioritize editability and clarity over visual flair.

---

## Code Quality Expectations

* Favor explicit, readable code over abstraction-heavy patterns.
* Avoid premature optimization and over-engineering.
* Structure code to support future features (e.g., manual entry, barcode scanning).

---

## Decision-Making Rule

When multiple approaches are possible:

1. Choose the simpler solution
2. Make it easy to change later
3. Briefly document the assumption
4. Proceed without blocking questions

---

These instructions apply globally and should not be restated in generated output.
