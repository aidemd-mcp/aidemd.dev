# Handoff: Source of Truth

Project rule for how the AIDE pipeline treats a Claude Design handoff folder during implementation.

## Rule

**The handoff folder is read-only verbatim source.** Every visible piece of the prototype — copy, design tokens, layout values, interactions, JSON-LD/schema, placeholder markers — is a byte-exact contract. The `design_reference/` subfolder is never edited by any agent at any phase.

## Why

A Claude Design handoff is the design team's locked artifact. It carries decisions that look cosmetic but are load-bearing:

- **Visible copy** carries the brand voice, the SEO/AEO payload, and (in `faq-rich`-style variants) the structured-data contract — the visible answer text and the `FAQPage` `acceptedAnswer.text` must stay byte-identical or the structured data is invalid and the variant loses the SEO/AEO reason it won the A/B test.
- **Tokens** (the `:root` CSS vars — colors, font stacks, type clamps, spacing scale, radii, shadows) are the design system. Rounding `clamp(40px, 5.2vw, 68px)` to `text-6xl` or substituting `#5eead4` for `text-teal-300` looks like a no-op and silently breaks the contract.
- **Interactions** (typewriter animations, scroll-triggered chart fills, sticky CTAs that slide in after hero leaves viewport, accordion auto-advance, `prefers-reduced-motion` branches, `localStorage` keys, keyboard handlers) are functional contracts. The prototype's behavior — including reduced-motion branches — is what the visitor experiences; reproducing only the visual is shipping half the product.
- **JSON-LD / schema** blocks (`FAQPage`, `Person`, `Organization`, `BreadcrumbList`) are byte-exact contracts. The visible text and the schema `text` field must stay identical. Drift between them is a structured-data violation that costs the AEO/SEO yield.
- **Placeholders** marked `*`, `[NEEDS COLLECTION]`, `[VERIFY]` exist precisely so agents do not fabricate values. Pricing conflicts (`$2.5k` vs `from $18k`), testimonial counts (`142 audits`), data-study stats (`73%`, `4,200+`) — when these are marked, ship the marker; do not invent.

Editing `design_reference/` corrupts the contract every downstream verification compares against. The Playwright visual-diff pass (see `playwright-visual-qa.md`) renders the prototype in a real browser to compare against the live route — if an agent has patched the prototype, the diff compares the live route against a moved goalpost and silent drift goes undetected.

## How to apply

### Spec phase
- The spec-writer treats the handoff `README.md` as the primary intent source.
- The README's **Acceptance criteria** checklist is promoted verbatim into `outcomes.desired`. No paraphrasing, no consolidating bullets.
- A **What NOT to do** section (when present) is promoted verbatim into `outcomes.undesired`.
- The README's **Fidelity** statement is reproduced in the spec's `intent:` line so every downstream phase knows the strictness level.
- If `landing-page-brief.md` exists, the strategist (when synthesize runs) folds it into `## Strategy` and `## Context` body sections — never paraphrased, always cited.

### Plan phase
- The architect reads `<handoff>/README.md` + `<handoff>/landing-page-brief.md` (if present) + every file under `<handoff>/design_reference/` for context — but treats `design_reference/` as read-only fixture, not a structural template.
- The plan must NOT include any step that edits `design_reference/`. If a rendering question arises during planning, surface it to the user — do not patch the prototype.
- The plan steps must promote handoff design tokens verbatim into the project's token surface (e.g., `tailwind.config.ts` `@theme`, `app/globals.css` `:root`, or the equivalent). The token values are quoted in the plan step itself so the implementor can copy them byte-exact.
- Plan steps decompose the prototype godfile into the project's framework using the **1fpf agent-readable-code disciplines** (orchestrator + helpers, one default export per file, schema-derived types, cascading verb-first folder names) — never mirror the godfile's bundled-concerns structure.

### Build phase
- Implementors copy visible strings, JSON-LD blocks, and token values verbatim from the prototype. Search-and-replace is fine for trivial transforms (e.g., HTML `&rarr;` → `→`); rewording or "improving" the copy is forbidden.
- Implementors who notice a placeholder marker (`*`, `[NEEDS COLLECTION]`, `[VERIFY]`) preserve it: either render the marker as-is in production, or ship a typed `TODO` stub with a comment naming what needs collection. They do NOT invent values to fill the slot.
- Implementors do NOT edit any file under `<handoff>/design_reference/` for any reason. If a prototype bug needs documenting, it gets a separate `todo.aide` item routed back to the user — never patched in-place.
- If a `JSON-LD` block exists in the prototype, the implementor renders both surfaces (visible copy + schema) from a single source-of-truth in production code (e.g., a `faqs: FaqItem[]` array imported by both the FAQ component and the `<Script type="application/ld+json">` emitter) so they cannot diverge.

### QA phase
- The QA agent compares live output against the handoff prototype as the authoritative reference (see `playwright-visual-qa.md` for the mechanics). The prototype is never compared against — only compared *to*.
- Copy drift is a `todo.aide` item with severity `implementation-drift` and a line-numbered diff between the live route and the prototype.
- Token drift (a `--bg-2` rendered as the wrong hex, a `clamp()` value rounded to a Tailwind class) is `implementation-drift`.
- Interaction drift (a hover state inverted, a sticky CTA missing the `IntersectionObserver`, a `prefers-reduced-motion` branch not implemented) is `implementation-drift`.
- Placeholder fabrication (an agent filled `$2.5k` into a slot the README marked `*`) is `implementation-drift` with a severity flag — those slots ship as markers or `TODO`, never invented.

### What this rule does NOT cover

- **Pre-implementation feedback** on the handoff itself. If the user has design concerns ("the CTA contrast is too low", "this copy is too long") that surface DURING implementation, the agent reports them to the user — it does not unilaterally fix them by editing the prototype. The user decides whether to request a new handoff or accept the noted drift.
- **Post-launch evolution.** Once the implementation is shipped and the cycle closes, the production code is the source of truth for that route; future changes happen via normal AIDE cycles, not via re-running this rule against an outdated handoff.
- **Brand-token drift across handoffs.** Multiple handoffs (`design_handoff_aeo_funnel`, `design_handoff_about_update`, etc.) should share the same `:root` token block. If they disagree, surface the disagreement to the user — do not silently pick one. This rule is per-handoff fidelity; cross-handoff coherence is a separate concern.

## Enforcement

This rule is referenced from `CLAUDE.md` so every session loads it. The `/aide` orchestrator embeds the relevant section excerpts into every spec, plan, build, and QA delegation prompt. Subagents reading this file at the start of their task is mandatory when the task touches a route that originated from a Claude Design handoff.

If the rule fails in practice — an agent paraphrases visible copy, patches `design_reference/`, fabricates a placeholder — surface it in the QA `## Retro` section so the failure gets recorded and the rule gets sharpened on the next cycle.
