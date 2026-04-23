# Handoff: aidemd.dev marketing + docs site

## Overview

This package contains the full design for the **aidemd.dev** marketing site and canonical docs — the public-facing website for the AIDE (Autonomous Intent-Driven Engineering) methodology and the `@aidemd-mcp/server` package.

It includes:
- A single-page marketing site (hero, three-layer model, interactive pipeline, intent-tree explorer, vault brain with tabs, animated CLI demo, OpenSpec comparison, quickstart, footer)
- A canonical docs area (index + two fully-written pages: `aide-spec`, `aide-template`) with a sidebar nav for all eight planned pages
- A floating mascot ("AIDEY") with contextual tips
- An exploration canvas (`index.html`) where three visual directions were compared side by side — the **Terminal** direction was chosen and is the one to build

## About the design files

The files in `prototypes/` are **design references created in HTML + React + Babel, rendered in the browser at runtime.** They are not production code. They use:
- Inline `<script type="text/babel">` with UMD React 18 + standalone Babel
- Inline style objects (no CSS framework)
- Google Fonts via `<link>` tags
- Relative paths for assets in `prototypes/assets/`

**Your job is to recreate these designs in the target codebase** — ideally Next.js 14+ App Router with MDX for docs, or Astro with MDX if SSG is preferred. Do not ship the Babel-in-browser setup. Pick whichever of these the existing `@aidemd-mcp/server` repo already uses; if none exists, Next.js 14 + Tailwind is the recommended target.

## Fidelity

**High-fidelity.** Pixel-perfect intent. Colors, typography, spacing, interactions are all finalized. Recreate exactly.

## Files in `prototypes/`

| File | What it is |
|---|---|
| `Terminal.html` | **The canonical marketing page.** Entry point. Renders the full homepage. |
| `docs.html` | Docs index — lists all 8 canonical doc pages |
| `docs-aide-spec.html` | Full docs page: "AIDE Spec" |
| `docs-aide-template.html` | Full docs page: "AIDE Template" |
| `variant-terminal.jsx` | The marketing page component tree (hero, pipeline, tree, brain, CLI, quickstart, footer) |
| `docs-shell.jsx` | Docs shell: sidebar, top bar, typography primitives, code blocks, tables, callouts, prev/next, footer |
| `shared.jsx` | Shared data: pipeline stages, intent-tree data, vault notes, example `.aide` files |
| `aidey.jsx` | Floating mascot component with contextual tooltips |
| `tweaks.jsx` | In-page tweak panel (accent color + typography pairing) — **strip from production**, it's a design tool |
| `index.html` + `variant-editorial.jsx` + `variant-linear.jsx` + `design-canvas.jsx` | Rejected directions + the exploration canvas — reference only, don't port |
| `assets/` | AIDEY mascot PNGs (teach, think, wave, point variants) — ship these |

## Visual system

### Palette

```css
--bg:       #0d0b08;   /* page background, near-black warm */
--card:     #16120d;   /* elevated surfaces, code-block chrome */
--card-2:   #0a0906;   /* deepest inset (code block interior) */
--fg:       #e8dfce;   /* primary text, warm off-white */
--dim:      rgba(232, 223, 206, 0.55);  /* secondary text */
--dim-2:    rgba(232, 223, 206, 0.38);  /* tertiary text, labels */
--border:   rgba(232, 223, 206, 0.12);
--hover:    rgba(232, 223, 206, 0.05);
--accent:   #3d6b4a;   /* primary accent — muted forest green */
--todo:     #d6b25a;   /* QA / todo.aide callouts */
--plan:     #7aa6d6;   /* plan.aide callouts */
--danger:   #ff5f56;   /* traffic-light red only */
```

The palette is warm-dark (not cool-blue dark). The accent is a muted forest green — never use a pure/saturated green. `#3d6b4a` exactly.

### Typography

- **All UI, headings, body, code:** `JetBrains Mono` (Google Fonts, weights 400/500/600/700).
- The terminal aesthetic uses monospace for everything. Do not introduce a second typeface.
- Base body size: `14px`, line-height `1.75`
- H1: `36px`, weight 600, letter-spacing `-0.5px`, line-height `1.1`
- H2: `22px`, weight 600, prefixed inline with a green `##` glyph, underlined by a 1px border
- H3: `16px`, weight 600, prefixed with `###`
- Lede paragraph: `16px`, line-height `1.7`
- Inline code: `13px`, padded `1px 6px`, background `rgba(232,223,206,0.06)`, 1px border, 3px radius, color = accent green

### Spacing

Consistent 4/8/12/14/16/18/20/24/28/32/40/44/60/64/80 scale in px. Don't invent new values.

### Borders & radii

- 1px borders everywhere, color `--border`
- Radii: `3px` inline code, `4px` callouts and table cells, `6px` code blocks and cards
- Accent bar treatment: `border-left: 2px solid var(--accent)` for emphasis cards, `border-left: 3px solid <kind>` for callouts

## Screens

### 1. Marketing homepage (`Terminal.html` → `variant-terminal.jsx`)

A single scrolling page styled as a full terminal window. Sections top to bottom:

1. **Window chrome** — sticky top bar with three traffic-light dots (`#ff5f56`, `#ffbd2e`, `#27c93f`), the label "aidemd.dev — zsh", right-side nav (`docs`, `pipeline`, `brain`, `github ↗`, `npm ↗`). The `docs` link goes to `docs.html`.
2. **Hero** — CLI-style: prompt `$`, typed command `npx @aidemd-mcp/server init`, big display headline about intent being the contract. Install line with copy button.
3. **Three-layer model** — three cards side-by-side: Brain / Spec / Code. Each card shows an icon, title, 1-line description, and a representative snippet (YAML frontmatter, file tree, etc.).
4. **Interactive pipeline** — row of clickable stages (`spec → research → synthesize → plan → build → qa`). Clicking a stage expands a panel below showing what it reads (inputs) and writes (outputs). Default selection: `spec`.
5. **Intent tree** — left column: expandable file tree of `.aide` files in a sample project. Right column: when a `.aide` is clicked, show its frontmatter (scope, description, intent, outcomes.desired, outcomes.undesired). Use `7aa6d6` for desired, `d6b25a` for undesired accent lines.
6. **Vault brain** — two-tab card: "Research" and "Playbook". Each tab lists a few brain notes with 1-line summaries.
7. **Animated CLI demo** — a terminal block that auto-types a sequence of `/aide:*` commands with their output. Loops. Use a typewriter effect, ~40ms per character.
8. **OpenSpec comparison table** — two columns: OpenSpec vs AIDE. 4–5 rows contrasting the approaches.
9. **Quickstart** — numbered 3-step install (`npx init`, write your first `.aide`, run `/aide:qa`).
10. **Footer** — copyright "© 2026 TetsuKodai Group LLC", links (install, github ↗, privacy), "canonical" dot.

**AIDEY mascot** floats fixed bottom-right (58px wide), with a small speech bubble tip that rotates based on scroll position.

### 2. Docs index (`docs.html`)

- Left sidebar (280px): lists all 8 docs pages (`aide-spec`, `aide-template`, `plan-aide`, `todo-aide`, `progressive-disclosure`, `agent-readable-code`, `automated-qa`, `cascading-alignment`) with two-digit numbers. Small AIDEY tip card at bottom. Sidebar is sticky.
- Main column: breadcrumb label, H1 "AIDE Canonical Docs", lede paragraph, then a vertical list of all 8 pages as cards (number + filename + "read →" link). Footer.

### 3. Docs page template (`docs-aide-spec.html`, `docs-aide-template.html`)

- Same sticky top bar + sidebar as docs index; active page highlighted with accent-left-border and tinted background (`rgba(61,107,74,0.12)`).
- Main column (max-width 1000px, padding `40px 64px 80px`):
  - Small uppercase breadcrumb label (`AIDE / Docs`)
  - H1 page title
  - **DocMeta card**: 3 rows in a 2-column grid — Published date (ISO timestamp), Source commit (monospace chip with hash), Cite as (clickable, click-to-copy, dotted underline green)
  - Body content: lede, H2/H3 sections, paragraphs, bulleted lists, inline code, code blocks with copy buttons, callouts (`note`/`warn`/`info`), two-column tables
  - Prev/next card row at bottom
  - Footer (copyright, nav links, "canonical" dot)

### DocMeta component

```
Published     | 2026-04-13T13:47:06-07:00
Source commit | [b859854]  ← monospace chip
Cite as       | https://aidemd.dev/docs/aide-spec?v=b859854  [copy icon]
```

On click of the URL, copy to clipboard, swap icon to "✓ copied" for 1.5s.

### Code blocks

```
┌────────────────────────────────────┐
│ label (dim)               copy ≡   │  ← card header, 11px, border-bottom
├────────────────────────────────────┤
│ pre text, 13px, line-height 1.65   │
│ (no syntax highlighting in design, │
│ but you should add it — prism or   │
│ shiki — using the accent green for │
│ keys/strings)                      │
└────────────────────────────────────┘
```

### Callouts

Three kinds, each with a 3px left border in its color and a small uppercase label:
- `NOTE` — accent green `#3d6b4a`
- `WARN` — amber `#d6b25a`
- `INFO` — blue `#7aa6d6`

## Interactions

- **Pipeline stages**: click to set active stage. Active stage has accent-green underline and brighter text. Panel below animates in (opacity + 4px translate, 180ms).
- **Intent tree**: click a folder to toggle children (caret rotates 90°). Click a `.aide` file to load its spec into the right panel.
- **Vault tabs**: tab click switches content. Active tab has accent underline.
- **CLI demo**: auto-play on mount, loops. 40ms/char type, 800ms pause between commands, 2s pause on full cycle.
- **AIDEY**: hovering shows a speech bubble with a hint relevant to the nearest section (IntersectionObserver).
- **Copy buttons** (DocMeta cite URL, code blocks): click → navigator.clipboard.writeText → swap label to "✓ copied" for 1500ms.
- **Sidebar**: active page highlighted; hover rows get `rgba(232,223,206,0.05)` background.

## State

Minimal. Local component state for:
- Active pipeline stage (string)
- Expanded tree nodes (Set of paths)
- Selected spec path (string)
- Active vault tab (string)
- Copy-feedback flags (boolean timers)

No global state, no routing state beyond Next/Astro defaults. No auth.

## Architecture recommendation

**Next.js 14 App Router + Tailwind + MDX** if you want docs to be markdown-authored (recommended for long-term maintenance since the docs content literally is markdown already).

```
app/
  layout.tsx              ← JetBrains Mono + metadata + global styles
  page.tsx                ← marketing homepage (Terminal.html)
  docs/
    layout.tsx            ← DocsShell (sidebar + top bar)
    page.tsx              ← docs index
    [slug]/
      page.tsx            ← MDX renderer with DocMeta, PrevNext
  _components/
    Aidey.tsx
    Pipeline.tsx
    IntentTree.tsx
    VaultBrain.tsx
    CliDemo.tsx
    CodeBlock.tsx         ← client component with copy button
    DocMeta.tsx           ← client component with copy
    Callout.tsx
content/
  docs/
    aide-spec.mdx         ← frontmatter: title, published, commit
    aide-template.mdx
    ... (6 more)
public/
  aidey-teach.png
  aidey-think.png
  aidey-wave.png
  aidey-point.png
```

MDX frontmatter drives the `DocMeta` card:
```yaml
---
title: AIDE Spec
slug: aide-spec
published: 2026-04-13T13:47:06-07:00
commit: b859854
---
```

The commit hash should be injected at build time from `git log -1 --format=%h -- content/docs/aide-spec.mdx` so citations are always accurate to the last edit of that specific file.

## Assets

All four AIDEY mascot PNGs are in `prototypes/assets/`. Ship them to `public/`:
- `aidey-teach.png` — pointer pose, used in sidebars
- `aidey-think.png` — thinking pose
- `aidey-wave.png` — waving, used in hero
- `aidey-point.png` — pointing, used in callouts

## What to strip

- `tweaks.jsx` and all the edit-mode postMessage logic — that's a design-tool scaffold, not product.
- `index.html`, `variant-editorial.jsx`, `variant-linear.jsx`, `design-canvas.jsx` — these are the rejected exploration directions.

## What to add that's not in the mocks

- Syntax highlighting in code blocks (Shiki or Prism, with a custom theme using `#3d6b4a` for keywords, `#d6b25a` for strings, `#e8dfce` for identifiers).
- OpenGraph / Twitter meta tags.
- `robots.txt`, `sitemap.xml`.
- Analytics (Plausible recommended — matches the quiet aesthetic).
- Real `/github`, `/npm` outbound links.
- Mobile breakpoints (the current mocks are desktop-only — collapse sidebar into a drawer below 768px).

## Reference URLs in mocks

The cite-as URLs use the pattern `https://aidemd.dev/docs/<slug>?v=<commit>`. Keep this exactly — it's a commitment: every doc URL is permanent-citable by commit hash.

## Definition of done

- Marketing page renders identically to `Terminal.html` at 1440px viewport
- Docs index and both written doc pages render identically to their HTML counterparts
- The 6 remaining doc pages (`plan-aide`, `todo-aide`, `progressive-disclosure`, `agent-readable-code`, `automated-qa`, `cascading-alignment`) are written as MDX using the same structure; content should be sourced from the real `.aide/docs/*.md` files in the `@aidemd-mcp/server` repo
- All interactions from the "Interactions" section work
- Mobile responsive down to 375px
- Lighthouse: ≥95 across the board
- No CLS on the hero (reserve space for the typing animation)
