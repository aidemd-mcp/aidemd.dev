# Handoff: Playwright Visual-Diff QA Pass

Project rule — every QA cycle on a handoff-derived route appends a **Playwright MCP visual-diff pass** that captures the live route AND the matching `design_reference/*.html` prototype in the same browser, then pixel-diffs them at named viewports.

## Rule

**After the AIDE QA agent completes its normal `outcomes.desired` / `outcomes.undesired` verification, it MUST run a Playwright MCP visual-diff pass:**

1. Confirm the dev server is up at its expected URL (default `http://localhost:3000`; override per the project's convention). The QA agent does NOT start the server — see the *Shared dev server* rule below.
2. Render each implemented handoff route in the Playwright browser. Capture full-page PNG (never JPEG).
3. Render the matching `<handoff>/design_reference/<surface>.html` prototype in the same Playwright browser (via `file:///` or a local static server if relative `<link rel="stylesheet">` paths misbehave). Capture full-page PNG.
4. Diff the two PNGs with `pixelmatch` at `threshold: 0.1` (PNG-vs-PNG; the 0.6 JPEG concession does NOT apply when both sides are true PNG).
5. Save all PNGs and diff outputs to `qa-artifacts/` (a gitignored folder at the project root — see *QA artifact placement* below).
6. Append a `## Playwright pass` section to `todo.aide` with the verdict.

## Shared dev server (inlined dependency)

Exactly one dev server runs per session. The orchestrator (or the user, in a detached terminal) starts it ONCE at the top of the session. The QA agent reuses that single server — it never spawns its own. Subagents spawning competing dev servers on adjacent ports has crashed prior sessions and produced ambiguous "which server is authoritative" failures. If the dev server is unreachable at the expected URL, the QA agent **reports back to the orchestrator** rather than starting one. The QA-scoped static server used for the prototype side (`npx serve <handoff>/design_reference`) is exempt — it runs on a non-default port and shuts down after the pass.

## QA artifact placement (inlined dependency)

All ephemeral QA artifacts — Playwright screenshots, diff PNGs, captured HTML, console logs — go in a single `qa-artifacts/` folder at the project root. The folder MUST be gitignored (`qa-artifacts/` added to `.gitignore`). Naming convention: `qa-artifacts/<date>-<route-slug>-<viewport>-<live|prototype|diff>.png`. Never save ephemeral captures to the repo root, to `public/`, to `app/`, or alongside production code — they leak into agent context on every read and force per-commit triage. The "single folder, gitignored, self-describing names" pattern keeps QA scratch invisible to everything except the pass that produced it.

The Playwright pass is **additive, not a replacement** for `outcomes` verification. Both run; both findings land in `todo.aide`.

## Why

Code-level QA verifies *contracts* (typed signatures, route handlers, schema responses). The Playwright pass verifies *what the visitor actually sees*. Both are needed; either alone has missed real bugs on prior handoff cycles:

- A token alias missing from `:root` rendered `.accent` as white instead of teal — code-level QA passed (the variable was referenced correctly); the visual diff caught it instantly.
- A hover state was inverted on engagement cards (highlight at rest, removed on hover) — outcomes contract said "card has highlight on hover"; the implementation arguably satisfied it; the visual diff against the prototype showed it was backwards.
- A CTA button rendered behind the grid background (z-index / stacking order wrong) — the button was clickable at the DOM level but visually buried; outcomes verification missed it; the visual diff surfaced it as a clear drift.
- A mobile breakpoint collapsed the hero in the wrong direction, squishing the text column under a ~90%-width terminal illustration — outcomes contract said "responsive at 375px"; the implementation was responsive but wrong; the visual diff against the prototype's mobile rendering caught the layout drift.

Code-level QA cannot catch this class of bug. The visual-diff pass is the floor under that gap.

### The JPEG baseline lesson

A prior cycle on this codebase used `screenshots/*.png` reference files that were in fact JPEG-encoded despite the `.png` extension (~90% quality). The diff pass against them was useless — JPEG double-compression meant every text pixel differed by 2-4% in pixelmatch even on visually-identical pages. The 0.5% pass threshold was unreachable, so the threshold got bumped to 0.6 to compensate, which then drowned out real CSS drift in JPEG noise.

**v2 lesson, encoded as a rule:** capture both sides as true PNG via Playwright at QA time. Do not rely on pre-existing baseline images that may be JPEG. Render the prototype freshly each pass — the prototype is read-only, but the *render* is generated.

## How to apply

### What the QA agent does, in order

1. **Read the handoff route table** from the handoff `README.md` (or from the AIDE `intent.aide` if the spec-writer captured it). For each row, you have:
   - `<route>` — the live URL (e.g., `/scan`, `/scan/quiz`)
   - `<prototype>` — the `design_reference/*.html` file (e.g., `scanner.html`, `quiz.html`)

2. **Confirm the dev server.** Single `curl -sI <expected-url>` check (default `http://localhost:3000`). If down, REPORT BACK to the orchestrator — do NOT spawn a new server (see *Shared dev server* above).

3. **For each route, capture at two viewports minimum:**
   - **Desktop: `1440 × 900`**
   - **Mobile: `375 × 812`**

   Add `1024 × 900` (tablet) when the `README.md` route table includes a tablet variant or when the design tokens declare a tablet breakpoint distinct from desktop and mobile.

4. **Capture the live side:**
   - `mcp__playwright__browser_resize` to the viewport
   - `mcp__playwright__browser_navigate` to `http://localhost:3000<route>`
   - `mcp__playwright__browser_take_screenshot` with `fullPage: true`, `type: 'png'`, save to `qa-artifacts/<date>-<route-slug>-<viewport>-live.png`
   - For routes with on-load animations (typewriter consoles, scroll-triggered chart fills, score count-ups), the prototype's intended *steady state* is the diff target. Either wait for the animation to complete (`browser_evaluate` an assertion against the relevant element's final state) or capture after a deterministic settle delay (e.g., 2500ms for typewriters, 1500ms for chart fills).

5. **Capture the prototype side:**
   - `mcp__playwright__browser_resize` to the same viewport
   - `mcp__playwright__browser_navigate` to `file:///<absolute-path>/<handoff>/design_reference/<prototype>`
   - If `file://` relative `<link rel="stylesheet">` resolution misbehaves (Chromium sometimes blocks `file://` cross-origin font fetches), spawn `npx serve <handoff>/design_reference` in the background and navigate to `http://localhost:5000/<prototype>` instead — this is a QA-scoped static server (NOT a dev server), distinct port, OK to spawn for the duration of the pass and shut down after.
   - Same `browser_take_screenshot` shape, save to `qa-artifacts/<date>-<route-slug>-<viewport>-prototype.png`
   - Honor the same animation settle approach as the live side, so both sides are captured at the same steady state.

6. **Diff with `pixelmatch`:**
   - `threshold: 0.1` for PNG-vs-PNG (the 0.6 JPEG concession does NOT apply here)
   - `includeAA: false` (anti-aliasing differences across rasterizers are noise; we want structural drift)
   - Write the diff PNG to `qa-artifacts/<date>-<route-slug>-<viewport>-diff.png`
   - Compute mismatch % = `mismatchedPixels / totalPixels`
   - **Pass ceiling: < 0.5%** total mismatched pixels per viewport per route. Above that, the route is FLAGGED.

   If the project already has a visual-diff helper script (any path) that wraps `pixelmatch` + `pngjs`, prefer running it over hand-rolling the comparison — but pass the freshly-captured PNG paths, not stale baselines.

7. **Cluster drift items.** Don't emit one `todo.aide` item per mismatched pixel — cluster by visible cause:
   - **Token drift** — a color, font-weight, or spacing value rendered different from the prototype (open the diff PNG; the red band traces the drifted element)
   - **Layout drift** — a section shifted vertically or horizontally; grid template wrong; gap miscalculated
   - **Interaction drift** — an element rendered in its rest state on one side and its active state on the other (capture both at the same state; if you can't, note the interaction mismatch)
   - **Missing element** — a section in the prototype that doesn't render in the live route at all
   - **Extra element** — a section in the live route that the prototype doesn't have
   - **Responsive drift** — the live route's mobile collapse differs from the prototype's mobile collapse (only at the mobile viewport)

8. **Append the `## Playwright pass` section** to `todo.aide`. Shape:

   ```markdown
   ## Playwright pass

   **Verdict:** PASS | DRIFT | BLOCKED-SERVER

   ### Routes verified
   - `<route>` @ `1440×900` — <PASS / NN.NN% mismatch>
   - `<route>` @ `375×812`  — <PASS / NN.NN% mismatch>
   - <repeat per route + viewport>

   ### Drift items (if any)
   - [ ] **<route> @ <viewport>** — <one-line description, e.g., "Hero CTA button rendered behind grid background; live z-index 0, prototype z-index 10">
     - Live: `qa-artifacts/<date>-<route>-<viewport>-live.png`
     - Prototype: `qa-artifacts/<date>-<route>-<viewport>-prototype.png`
     - Diff: `qa-artifacts/<date>-<route>-<viewport>-diff.png`
     - Cluster: <token-drift | layout-drift | interaction-drift | missing-element | extra-element | responsive-drift>
     - Traces to: <outcome line from `.aide/intent.aide` it violates>
     - Misalignment: implementation-drift
   ```

   A clean pass collapses the drift items section to a single line: `No drift detected vs handoff prototype at any captured viewport.`

### Edge cases

- **Animations don't settle deterministically.** If a route has a perpetual loop (e.g., typewriter that cycles forever), capture in `prefers-reduced-motion` mode (`browser_evaluate` to inject the media query) so both sides render the static final frame. This matches how the prototype's reduced-motion branch is supposed to behave.
- **Data-dependent routes.** If a route renders content from a CMS (Sanity posts, dynamic article pages) and the CMS is empty or out of sync, the diff will catch an `EmptyState` vs the prototype's populated card grid. That is `data-state-drift`, NOT `implementation-drift` — record it as such and DO NOT silently skip the route. The orchestrator routes data-state-drift to a separate fix flow (seed the CMS, relax the GROQ guard, mount a local fixture); the visual-diff item gets re-run after the data state is fixed.
- **Routes the prototype doesn't cover.** Some routes (`/api/*`, `/studio/*`, dynamic redirects) have no prototype. Skip them in the Playwright pass and note `No prototype — Playwright pass not applicable` per skipped route. Do not invent a baseline.
- **Multiple variants of the same surface.** When a handoff ships an A/B (e.g., `scanner.html` Variant A and `data-study.html` Variant B for the same `/scan` route), diff each variant against its own live render — run the live route with the appropriate experiment bucket forced via cookie or query param.
- **404 / error pages.** If the prototype includes a custom 404, the Playwright pass should hit a known-bad route to render it. Mirror the live 404 to the same.

### Things the Playwright pass does NOT do

- **It does not patch the prototype.** Per `handoff-source-of-truth.md`, `design_reference/` is read-only. If the prototype itself has a bug, surface it as a `todo.aide` item under `## Playwright pass` with severity `spec-gap` so the user can decide whether to request an updated handoff. Do not edit the prototype to make the diff cleaner.
- **It does not replace targeted unit / integration tests.** `outcomes.desired` items often have non-visual contracts (route returns 200, `localStorage` carries the right key, the quiz `next()`/`back()` advance correctly). Those are the AIDE QA agent's normal beat. The Playwright pass is purely the visual layer on top.
- **It does not start the dev server.** The dev server runs in a separate terminal window owned by the user or orchestrator (see *Shared dev server* above). The QA agent probes it once; if down, it reports back. The QA-scoped static server (`npx serve <handoff>/design_reference`) is exempt — it is short-lived, scoped to the pass, and runs on a non-default port.

## Enforcement

This rule is referenced from `CLAUDE.md` so every session loads it. Every orchestrator QA delegation prompt against a handoff-derived route must include the rule's name and a one-line summary so the QA agent loads this file at the start of its task.

If the pass is skipped or runs against JPEG baselines, surface it in `todo.aide`'s `## Retro` section so the failure gets recorded and the rule gets sharpened on the next cycle.
