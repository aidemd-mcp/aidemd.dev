# Handoff: Pixel-Fidelity Acceptance

Project rule for translating a Claude Design handoff's **Acceptance criteria** checklist into the AIDE `outcomes` contract — and for what "pixel-match" means as an outcome the QA agent can actually verify.

## Rule

**The handoff README's `## Acceptance criteria` checklist IS `outcomes.desired` in the implementation's `.aide` spec.** Promote it verbatim — every checkbox becomes one bullet in `outcomes.desired`. The `## What NOT to do` section (when present) IS `outcomes.undesired`, also verbatim. No paraphrasing, no consolidating, no editorial choices.

When the README says "high-fidelity, match pixel-for-pixel," the QA agent's verdict on a route is `PASS` only when:

1. Every code-level outcome (`outcomes.desired` bullets that name a behavior, contract, or build artifact) verifies.
2. Every code-level negative outcome (`outcomes.undesired`) is absent.
3. The Playwright visual-diff pass (per `playwright-visual-qa.md`) reports `< 0.5%` pixel mismatch at every named viewport on that route.

Any of (1), (2), or (3) failing routes the item into the fix loop. None of the three substitutes for the others.

## Why

Pixel-fidelity is the brand's load-bearing promise. Whatever voice the brand claims — "engineering-credible," "premium," "design-led" — that promise concretely translates into *the live site looks like the design handoff*. Drift is not a cosmetic issue; it is a brand integrity issue. The decision to use Claude Design at all rests on the handoff being a contract the implementation honors, not a vague reference the implementation approximates.

The standard AIDE `outcomes.desired` block is excellent for behavior and contracts but lousy for visual outcomes. "Hero renders correctly" is unverifiable; "Hero matches `design_reference/scanner.html` pixel-for-pixel at 1440×900" is verifiable but only if the QA agent has a tool that can actually verify it. The Playwright visual-diff pass (the other rule in this folder) is that tool; this rule is the contract that says **the handoff's Acceptance criteria are the spec's outcomes, and pixel-match is a QA condition, not a nice-to-have.**

Past handoff cycles on this codebase made the opposite choice and paid for it:

- Outcomes were written in plain language ("hero renders correctly", "tokens look right"). Implementors interpreted them generously. QA passed. The user opened the live site and the StatsGrid color contrast was failing WCAG AA on three spans (`color-contrast` Lighthouse violation, surfaced 200 PRs later).
- Outcomes were truncated from the README's 13-item Acceptance checklist down to 4 "high-level" bullets. Implementors satisfied the 4 bullets and skipped the rest. The skipped items (404 page in Console aesthetic, custom favicon, per-post OG image) were tracked separately and rotted in backlog.
- Outcomes treated pixel-fidelity as aspirational. QA verified contracts only. The site shipped with a sticky CTA that never appeared (`IntersectionObserver` on `.hero` was wired to the wrong element). Contracts passed; visitors got a button-less experience.

This rule blocks all three failure modes by binding the spec to the README's checklist verbatim and the QA pass to the visual diff.

## How to apply

### Spec phase

- The spec-writer (or the orchestrator if running Shape B) opens `<handoff>/README.md` and locates the `## Acceptance criteria` section.
- Each `- [ ]` bullet from that section is copied verbatim into `outcomes.desired` as a bullet. Order is preserved; wording is preserved.
- If a bullet has a sub-list (e.g., "All four surfaces render pixel-matched at 1440 / 1024 / 375"), the sub-list is preserved as a sub-bullet, not flattened.
- If the README has a `## What NOT to do` section, each bullet there becomes a bullet in `outcomes.undesired`, also verbatim.
- The spec's `intent:` field reproduces the README's **Fidelity** statement ("High-fidelity. Match pixel-for-pixel.") so every downstream phase loads the strictness level from the spec itself.
- The spec-writer does NOT add their own outcomes. The README is authoritative; the spec is the receiver. If the spec-writer believes an outcome is missing, they surface it to the orchestrator/user — they do not silently add it.

If the brevity caps in `aide-spec.md` would force truncation, the spec-writer **routes back to the user** instead of paraphrasing. Verbatim outcomes are the contract; truncation breaks it. The brevity contract bends here; the handoff verbatim policy does not.

### Plan phase

- The architect reads `outcomes.desired` (now the verbatim README checklist) and turns each bullet into one or more numbered plan steps. The mapping is many-to-one or many-to-many — a single Acceptance bullet may require several plan steps, and several Acceptance bullets may share a step.
- Each plan step is annotated with which Acceptance bullet(s) it satisfies, so the QA agent can later trace back ("Step 7 implements bullets 3 + 11").
- Plan steps that satisfy Acceptance bullets containing "pixel-matched" explicitly call out the viewport(s) named in the bullet — e.g., a step that builds the Hero component for `/scan` has a `Verify:` line saying "Playwright visual diff against `design_reference/scanner.html` at 1440×900 and 375×812 returns < 0.5% mismatch."

### Build phase

- Implementors execute the plan. Per `handoff-source-of-truth.md`, they copy visible strings, JSON-LD blocks, and token values verbatim from the prototype.
- Implementors do NOT short-circuit Acceptance bullets they think are "minor." Custom 404 in Console aesthetic, favicon glyph, per-post OG image — all are first-class outcomes per the spec. They are scheduled in the plan, executed, and verified.

### QA phase

- The QA agent verifies each `outcomes.desired` bullet against the live implementation:
  - Behavioral bullets (e.g., "Console hero typewriter cycles and pauses when tab is hidden") — verify by Playwright `browser_evaluate` against the relevant element / event listener; capture before/after screenshots for the report.
  - Contractual bullets (e.g., "Lighthouse ≥ 95 across the board on home and a blog post") — run the named tool, attach the artifact.
  - Visual bullets (e.g., "All four surfaces render pixel-matched at 1440 / 1024 / 375") — verify via the Playwright visual-diff pass per `playwright-visual-qa.md`. Pass ceiling is `< 0.5%` mismatch per route per viewport. Failures cluster into `todo.aide` items.
- Negative outcomes (`outcomes.undesired`) are checked as inverse assertions. "Don't ship a light-mode toggle" → grep the codebase + DOM for a theme toggle; absence is the pass.
- The verdict per route is `PASS` only when ALL of (code-level, contractual, visual) are clean. Any leak routes to the fix loop.

### Acceptance bullets that can't be auto-verified

Some Acceptance bullets are user-facing approvals ("Custom 404 page in Console aesthetic" — the agent can verify a 404 page exists with the right tokens, but "feels Console" is a human judgment). For these:

- The QA agent records the verification it CAN do (404 page exists at `/_404`, uses the right tokens, includes a CTA back home) and saves a Playwright screenshot of the rendered page.
- The bullet is marked `[verified-mechanically; awaiting user approval]` in `todo.aide` rather than `[ ]` or `[x]`.
- The orchestrator surfaces these to the user at completion time for a final human ack before flipping `[x]`.

This preserves the verbatim outcome (the bullet stays in `outcomes.desired`) while making the QA agent's epistemic boundary visible — it doesn't claim to have verified something it can't measure.

### Placeholders, again

The handoff's Acceptance criteria sometimes includes a meta-bullet like "Resolve all `*` / `[NEEDS COLLECTION]` markers before launch." That bullet IS NOT a license for the agent to invent values — it is a recurring flag the user must resolve. Per `handoff-source-of-truth.md`, the agent ships the markers (or `TODO` stubs) and the bullet stays open in `todo.aide` as `[ ] AWAITING-USER-DATA` until the user supplies the real values. The cycle does NOT close on inventions.

### What this rule does NOT cover

- **Brand-level visual review.** This rule binds the handoff implementation to the handoff. It does not assess whether the handoff itself is on-brand — that is the user's choice during the design phase, and Claude Design is the tool used to make it.
- **Cross-cycle drift.** Once an Acceptance bullet flips `[x]` and the cycle closes, the production code is the source of truth for that bullet. Future changes happen via normal AIDE cycles. This rule is not a perpetual re-verifier; it is a per-cycle gate.
- **Performance budgets beyond what the README states.** The README is the contract — if Lighthouse ≥ 95 is not in the README's Acceptance criteria, the QA agent does not enforce it. Use a separate project rule or a dedicated `todo.aide` track for performance budgets that span beyond handoff cycles.
- **Accessibility audits beyond what the README states.** Same shape — `prefers-reduced-motion`, color-contrast, ARIA landmarks are usually in the README; if they are, they're outcomes; if they're not, a separate accessibility rule handles them.

## Enforcement

This rule is referenced from `CLAUDE.md` so every session loads it. The `/aide` orchestrator embeds the rule's contract section into the spec-writer's delegation prompt at Stage 1 (so the README's Acceptance criteria flow verbatim into `outcomes.desired`) and into the QA agent's delegation prompt at Stage 6 (so the Playwright pass threshold and the route-by-viewport verdict are explicit).

If the rule fails in practice — outcomes get paraphrased, the QA pass declares `PASS` without running the Playwright diff, an invented placeholder ships — surface it in `todo.aide`'s `## Retro` section so the failure gets recorded and the rule gets sharpened on the next cycle.
