# Handoff — `/observer` page (the observer)

**Target:** add a new `/observer` feature page to the existing AIDEMD.DEV site: a short, product-first page built around captures of the real observer in the site theme.
**Status:** additive. New page + one nav entry on existing pages. No existing component changes.
**Source design:** `observer.html` in this package. It uses the design canvas to show **two variants side by side** at 1280, both again at 390, plus the mobile menu open. Pick one before integrating; see §1.
**Supersedes:** the v1 observer page (`observer.html` + `HANDOFF-observer-v1.md` in the design project). Don't ship v1. This package's `observer.html` is the v2 comparison page, not the v1 file of the same name.

---

## 1. Pick a variant (required before integration)

`observer.html` shows two takes on the same content. They share every primitive and every string (`observer-shared.jsx`); only the layout differs.

| | Variant A — Capture-led stack | Variant B — Annotated capture |
|---|---|---|
| Source file | `observer-variant-capture-stack.jsx` | `observer-variant-annotated.jsx` |
| Component | `<ObserverVariantCaptureStack />` | `<ObserverVariantAnnotated />` |
| Shape | Short hero → capture full width with the state legend beside it → six sections as a two-column grid, Setup full width → closing action | Hero copy (380px column) beside the capture. Four numbered callouts on the capture (1 rail, 2 "1 live", 3 waiting, 4 maybe stuck) link to the matching numbered sections directly below. Then How it knows / Local and private / Setup in two columns → closing action |
| Best for | A reader who wants to see the product first and scan the rules after | A reader who wants each part of the UI explained where it sits |
| State legend | Yes, beside the capture | No (the callouts do that job) |
| Design width | 1280 desktop (artboard 1280×3300); 390 mobile (390×5120). Content max-width 1180px | 1280 desktop (1280×3120); 390 mobile (390×4910). Hero stacks at ≤ 1000px container width |
| Maintenance | Nothing tied to pixel positions in the capture | Callout positions (`O2_PINS`) are percentages of the capture and must be re-tuned whenever it's re-shot |

**Recommendation: ship A (Capture-led stack).** It shows the capture largest, it is the only variant with the state legend (the one place that separates what the observer shows from the HALT / BLOCKED agent replies), and nothing in it breaks when the capture is re-shot. B's callouts are a nice touch, but they are tied to pixel positions in a capture that will change as the observer changes, and at 390 the 24px pins sit over text that is too small to read anyway.

The rest of this handoff assumes A. To ship B, follow the **Variant B substitution** notes inline.

---

## 2. What to ship

A new public page at `/observer` (file: `observer.html` at the site root, sibling to `Terminal.html`, `docs.html` and `brain.html`).

```
observer.html                          ← new page (template in §4; NOT the canvas file from this package)
observer.css                           ← all page styles, scoped under .o2
observer-shared.jsx                    ← copy as-is
observer-variant-capture-stack.jsx     ← copy as-is  (Variant A)
# Variant B substitution: copy observer-variant-annotated.jsx instead
assets/observer-capture-aidemd.png      ← hero capture, 1x (1440×1180)
assets/observer-capture-aidemd@2x.png   ← hero capture, 2x
assets/observer-capture-aidemd-rail.png      ← rail close-up, 1x (1018×64)
assets/observer-capture-aidemd-rail@2x.png   ← rail close-up, 2x
```

No new build step, no bundler changes: same inline-Babel approach as the rest of the site.

---

## 3. Source files to copy

Copy these from this package to the site, preserving filenames:

| From (this package) | To (site) | Notes |
|---|---|---|
| `observer-shared.jsx` | `observer-shared.jsx` | All copy (`O2`), nav (`O2_NAV`, `<O2Nav>`), agent-reply snippets (`AGENT_REPLIES`, `<AgentReply>`), state icons/labels (`<SI>`, `<SL>`), state legend, capture frame, section blocks, close, footer. **Required** by both variants. |
| `observer-variant-capture-stack.jsx` | `observer-variant-capture-stack.jsx` | Variant A. The full page body. |
| *(optional)* `observer-variant-annotated.jsx` | `observer-variant-annotated.jsx` | Variant B, with its callout positions `O2_PINS`. Only if you ship B. |
| `observer.css` | `observer.css` | All styles, scoped under `.o2`. Required by both. |
| `assets/observer-capture-aidemd.png` + `@2x` | `assets/` | Hero capture. |
| `assets/observer-capture-aidemd-rail.png` + `@2x` | `assets/` | Rail close-up in "The pipeline rail". |

**Do not** copy `design-canvas.jsx`. It is only the comparison harness on this package's `observer.html` (included so that file opens on its own). The shipped page renders the variant directly, fullscreen.

**Do not** copy `observer.html` from this package verbatim. It wraps both variants in a `<DesignCanvas>`. Use the template in §4 instead.

**Do not** copy (reference only):
- `assets/observer-aidemd-theme.css`: the source of every colour value (§6). The page doesn't load it; it re-themes the observer app itself.
- `assets/observer-capture-aidemd-session.png`: a capture of a single session view, included as uploaded. Not used by either variant (its footer rail clips the Done chip).

---

## 4. The new `observer.html` (site version)

Create this at the site root. It uses the same `<head>` as `Terminal.html` / `docs.html` (JetBrains Mono 400/500/600/700, the same React 18.3.1 / Babel 7.29.0 pins and SRI hashes, the same base `<style>`), adds `observer.css`, and renders the chosen variant fullscreen.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>the observer · AIDEMD.DEV</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
<style>
  html, body { margin: 0; padding: 0; background: #0d0b08; }
  body { font-family: 'JetBrains Mono', monospace; }
  * { box-sizing: border-box; }
</style>
<link rel="stylesheet" href="observer.css" />

<!-- React / Babel — same pins as the rest of the site -->
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

<!-- OG tags (title / description: see Open items) -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="AIDEMD.DEV" />
<meta property="og:url" content="https://aidemd.dev/observer" />
<meta property="og:title" content="the observer · AIDEMD.DEV" />
<meta property="og:description" content="Local. Read-only. One web view across every project on your machine." />
<meta property="og:image" content="https://aidemd.dev/assets/observer-capture-aidemd.png" />
<meta property="og:image:width" content="1440" />
<meta property="og:image:height" content="1180" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="the observer · AIDEMD.DEV" />
<meta name="twitter:description" content="Local. Read-only. One web view across every project on your machine." />
<meta name="twitter:image" content="https://aidemd.dev/assets/observer-capture-aidemd.png" />
</head>
<body>
<div id="root"></div>

<script type="text/babel" src="observer-shared.jsx"></script>
<script type="text/babel" src="observer-variant-capture-stack.jsx"></script>
<!-- Variant B substitution: replace the line above with: -->
<!-- <script type="text/babel" src="observer-variant-annotated.jsx"></script> -->

<script type="text/babel">
  ReactDOM.createRoot(document.getElementById('root'))
    .render(<ObserverVariantCaptureStack />);
  // Variant B substitution: render <ObserverVariantAnnotated /> instead.
</script>
</body>
</html>
```

Notes:
- **Viewport is `width=device-width`**, unlike the canvas-era `brain.html` (`width=1400`). The page is responsive: container queries on `.o2` switch to the narrow layout at ≤ 760px container width (≤ 1000px for B's hero and callout sections, and for A's legend, which becomes a 3-column strip).
- Don't pass `menuOpen`: it only exists so the canvas can show the drawer open. The `slot` prop is unused.
- The OG image is the hero capture (as decided in the v2 design notes). It is 1440×1180, not 1.91:1, so link cards will crop it; see Open items.

**Why no design-canvas wrapper?** The canvas is a comparison tool for design review. End users get the chosen variant directly, full viewport.

---

## 5. Site nav — add an `observer` link

Target nav on every page that has one: **`docs · brain · observer · github ↗ · npm ↗`**.

### 5a. On the observer page (already built in)

`<O2Nav>` in `observer-shared.jsx` renders it from `O2_NAV`. No change needed.

- **Desktop (> 760px):** window dots (`#ff5f56` `#ffbd2e` `#27c93f`), brand `$ aidemd.dev/observer` linking to `Terminal.html`, links right-aligned, 24px apart, 13px. The current page (`observer`) gets `#e8dfce` text, a 2px `#3d6b4a` underline and `aria-current="page"`. Nav is sticky at the top.
- **Mobile (≤ 760px):** dots and links hide; a `≡ menu` button (bordered `#6e685d`) toggles a drawer under the nav, and reads `× close` while open. The drawer lists the same five links full width (15px, 14×18px padding); `observer` is green `#6aaa7c` with a 3px `#3d6b4a` left bar and a small `you are here` on the right. The button carries `aria-expanded`.

### 5b. On the existing pages

Add the `observer` entry (and `brain`, if the brain handoff hasn't landed yet) to each existing top bar, in the order above. Their nav styling stays as it is.

**`docs-shell.jsx`** (top bar, around lines 41–45; it currently reads `home · github ↗ · npm ↗`):

```jsx
<span style={{ marginLeft: 'auto', fontSize: 11, color: p.dim, display: 'flex', gap: 20 }}>
  <a href="Terminal.html" style={{ color: 'inherit', textDecoration: 'none' }}>home</a>
  <a href="docs.html"     style={{ color: 'inherit', textDecoration: 'none' }}>docs</a>      {/* ← add if not present */}
  <a href="brain.html"    style={{ color: 'inherit', textDecoration: 'none' }}>brain</a>     {/* ← add if not present (brain handoff §5a) */}
  <a href="observer.html" style={{ color: 'inherit', textDecoration: 'none' }}>observer</a>  {/* ← add */}
  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>github ↗</a>
  <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>npm ↗</a>
</span>
```

**`variant-terminal.jsx`** (rendered by `Terminal.html`, top bar around lines 32–37; it currently reads `docs · pipeline · brain · github ↗`, where `pipeline` and `brain` have no `href`): add `<a href="observer.html" …>observer</a>` after `brain`, using the same inline style as its neighbours. Whether to keep the `pipeline` entry, and to give `brain` its `href`, is a call for the site owner: this handoff only adds `observer`.

**`brain-variant-walkthrough.jsx` / `brain-variant-cookbook.jsx`** (top bar reads `home · docs · github ↗`, as plain `<span>`s): add `observer` in the same style if the brain page ships with this nav.

**Mobile on the existing pages:** none of them has a collapsing menu today (their navs are fixed rows). Adding the entry to the row is all this handoff asks; giving those pages the `≡ menu` drawer is out of scope (§12). If a page does have a mobile menu by the time this ships, add `observer` there in the same position.

---

## 6. Tokens — colours, fonts, spacing

All values live in `observer.css`, as custom properties on `.o2`. Every colour is taken from `assets/observer-aidemd-theme.css` (the observer re-themed onto the site palette), so the page and the captures match.

### 6a. Colour tokens (`.o2`)

| Token | Value | Theme source | Used for |
|---|---|---|---|
| `--bg` | `#0d0b08` | `--bg` | page background, capture frame fill, pin ring, pin/number text |
| `--card` | `#16120d` | `--surface` | nav, drawer, legend, close panel, reply header, hooks cells |
| `--deep` | `#0a0906` | — (page-only, darker than bg) | install command box, reply body |
| `--raised` / `--hover` | `#231e19` | `--raised` | inline `code` background |
| `--fg` | `#e8dfce` | `--text` | headings, primary text, current nav link, pins, section numbers |
| `--body` / `--dim` | `#aba497` | `--text-2` | body copy, legend notes, nav links, footer, kv labels |
| `--dim2` | `#948e82` | `--text-3` | tertiary labels, reply header, legend separator |
| `--border` | `#272420` | `--border` | all hairlines and card borders |
| `--border2` | `#6e685d` | `--border-strong` | pain-line rule, menu button, close panel border, drawer bottom, `.ph` dashed border |
| `--accent` | `#3d6b4a` | site accent (fills only) | install box border, copy button fill, nav underline, drawer bar, docs-link border. **Never text** (3.18:1 on bg) |

### 6b. State colours (four in total)

| State | Colour | Theme source | Shape | Label |
|---|---|---|---|---|
| working | green `#6aaa7c` text (`--s-live`); `#3d6b4a` for fills | `--run` / accent | filled dot, slow pulse (2.4s) | `working` |
| waiting for you | amber `#d6b25a` (`--s-amber`) | `--wait` / `--warn` | hollow ring | `waiting for you` |
| maybe stuck | grey `#948e82` (`--s-grey`) | `--text-3` | hollow triangle, no motion | `maybe stuck · quiet 15m` |
| ended / end session | grey `#948e82` (`--dim2`), weight 500 | `--text-3` | check | `ended · 2h ago` / `ended` / `end session` |
| HALT | red `#ff5f56` (`--s-red`) | `--danger` | stop octagon | `HALT` |
| BLOCKED | red `#ff5f56` (`--s-red`) | `--danger` | filled triangle | `BLOCKED` |

The amber `#d6b25a` is also the DRAFT marker colour (dashed border + text).

Text `#e8dfce` / `#aba497` / `#948e82` on surfaces `#0d0b08` / `#16120d` / `#231e19`: every pair is ≥ 4.5:1 (measured contrast table at the top of the theme file; lowest is `#948e82` on `#231e19` at 5.07:1).

### 6c. Other colour values in `observer.css` / the nav

| Value | Where | Note |
|---|---|---|
| `#ff5f56`, `#ffbd2e`, `#27c93f` | nav window dots | Same as every other page's top bar |
| `#fff` | copy-button label on `#3d6b4a` | |
| `rgba(0,0,0,.6)` / `rgba(0,0,0,.45)` | capture shadow `0 16px 48px …, 0 2px 6px …` | Same as theme `--shadow` |
| `rgba(13,11,8,.75)` | pin halo (4px; 3px on mobile) | `#0d0b08` at 75% |
| `rgba(61,107,74,.2)` | docs-link hover fill | `#3d6b4a` at 20% |
| `rgba(140,194,154,.07)` | B: `:target` highlight gradient on a callout section | `#8cc29a`, not a theme value; see Open items |

### 6d. Font

`JetBrains Mono` 400 / 500 / 600 / 700, already loaded site-wide; fallback `ui-monospace, monospace`. Base 15px / line-height 1.65, `-webkit-font-smoothing: antialiased`. No other family.

| Size | Weight | Element |
|---|---|---|
| 44px / lh 1.12 / −0.4px tracking | 500 | h1 (A desktop) |
| 36px | 500 | h1 (B desktop hero) |
| 29px | 500 | h1, both variants ≤ 760px |
| 24px (20px ≤ 760px) | 600 | closing heading |
| 21px / lh 1.3 | 600 | section headings |
| 17px (B: 16px; ≤ 760px: 15px) | 400 | subhead |
| 15px / lh 1.7 | 400 | body, pain line, drawer links |
| 14.5px | 400 | row text (states / one-session rows) |
| 14px | 600 brand, docs link; 400 otherwise | install command, "then run…", kv list, brand |
| 13.5px | 600 (ended 500) | state labels |
| 13px | — | nav links, kicker (2px tracking), facts, legend notes, reply body, hook names, footer, B callout keys, pins (700) |
| 12.5px | 600 | copy button |
| 12px | 500 legend title | legend title (1.4px tracking, uppercase), legend separator (1px, uppercase), reply header, drawer "you are here" |
| 11.5px | 600 / 700 | DRAFT marker (1px tracking); B key numbers (700); mobile pins (700) |

### 6e. Spacing, radii, layout

| Thing | Value |
|---|---|
| Content column | `max-width: 1180px`, padding `0 56px` (`0 18px` ≤ 760px) |
| Nav | padding `12px 24px` (`10px 16px` ≤ 760px), gap 10px; dots 11px, gap 7px; brand margin-left 12px; links gap 24px, link padding 4px 0 |
| Menu button | padding `7px 12px`, radius 4px; drawer is sticky at `top: 51px` |
| A hero | padding `56px 0 30px` (`32px 0 22px` ≤ 760px), max-width 860px |
| A capture + legend | grid `1fr 270px`, gap 16px; legend 1 column ≤ 760px, 3 columns ≤ 1000px |
| A sections | 2 columns, gap `48px 56px`, top padding 64px; 1 column, gap 36px, top 44px ≤ 760px |
| B hero | grid `380px 1fr`, gap 40px, padding `48px 0 20px` (`32px 0 12px`, gap 24px ≤ 760px); 1 column ≤ 1000px |
| B callout keys | margin-top 18px, padding 14px 0, gap `8px 18px`; key circles 22px |
| B callout sections | grid `260px 1fr`, gap 32px, padding 30px 0 (24px ≤ 760px), `scroll-margin-top: 70px`; 1 column, gap 10px ≤ 1000px |
| B tail | 2 columns, gap `48px 56px`, top 48px |
| Kicker → h1 | 14px; h1 → sub 16px; sub → pain 20px; pain → install 26px; install → facts 18px |
| Pain line | 2px left rule, padding-left 14px, max-width 640px |
| Install box | padding `10px 14px`, gap 12px, radius 5px; copy button padding `5px 10px`, radius 3px, margin-left 6px; install → "then run" gap 10px |
| Facts | gap `6px 18px` |
| Capture frame | ratio 1440:1180, radius 8px |
| Pins | 30px (24px ≤ 760px), 2px border |
| Rail shot frame | margin-top 16px, padding `10px 12px`, radius 6px; image min-width 620px, max 1018px, scrolls sideways when narrower |
| Legend | radius 8px; title padding `14px 16px 10px`; rows `11px 16px`, gap 3px; separator `9px 16px 6px` |
| Section heading | margin-bottom 10px, gap 10px; B numbers 26px circles |
| Paragraph rhythm | 12px between paragraphs |
| Rows | margin-top 14px; grid `150px 1fr`, gap 14px, padding 11px 0 (1 column, gap 4px ≤ 760px) |
| Agent replies | 2 columns, gap 10px, margin-top 16px, radius 6px; header `7px 12px`; body `12px 14px`, 13px / lh 1.65 (1 column ≤ 760px) |
| Hooks grid | 5 columns, gap 6px, margin-top 14px; cells `9px 11px`, radius 5px (2 columns ≤ 760px) |
| Setup list | grid `130px 1fr`, gap `8px 16px`, margin-top 14px; 1 column ≤ 760px |
| Docs link | margin-top 18px, padding `10px 16px`, radius 5px |
| Close panel | padding `32px 36px` (`22px 18px` ≤ 760px), radius 10px; margin-top 64px (A) / 56px (B) |
| Footer | margin-top 56px, padding `22px 0 44px`, link gap 20px |
| Inline `code` | padding `1px 6px`, radius 3px, 0.92em |
| DRAFT marker | padding `3px 6px`, margin-left 8px, radius 3px |
| `.ph` placeholder tag | padding `2px 8px`, radius 3px, italic |

---

## 7. External links to verify

Replace before deploy:

| Where | Currently | Should be |
|---|---|---|
| Setup section: `Hooks — full reference in the docs →` | `docs.html#hooks` | The **Hooks** section of the docs (after Skills), once it ships from `@aidemd-mcp/server`. Confirm the final page and anchor; `#hooks` is a guess. |
| **Install command**, in the hero and in the closing panel (both variants), and the text the copy button copies | `[INSTALL COMMAND — TO CONFIRM]` | The confirmed install command. One string: `O2.install` in `observer-shared.jsx`. **Placeholder by design** — the landing page's `npx @aidemd-mcp/server@latest init` was deliberately not used. |
| Nav `github ↗` (desktop row + mobile drawer) | `#` | the repo URL |
| Nav `npm ↗` (desktop row + mobile drawer) | `#` | the npm package page |
| Footer `github ↗` / `npm ↗` | `#` | same as above |
| Nav `brain` | `brain.html` | 200 only once the `/brain` handoff has shipped |
| Nav/footer `docs`, brand link | `docs.html`, `Terminal.html` | already live; confirm |
| B only: callout links `#b-rail`, `#b-own`, `#b-states`, `#b-quiet` | in-page anchors | no change |

`127.0.0.1:24680` in "then run /aide…" is a displayed address, not a link.

---

## 8. Functional dependencies (things to test)

The page is rendered by React like the rest of the site, so JS is needed to render it at all. Beyond rendering, **both variants need client-side JS for exactly two things**; everything else is static and could be pre-rendered:

1. **Mobile menu toggle** (`<O2Nav>`, `useState`). `≡ menu` ↔ `× close`, shows/hides the drawer, updates `aria-expanded`. Only visible ≤ 760px.
2. **Copy button** (`<Install>`, `useState` + `navigator.clipboard`). Copies `O2.install`, shows `copied` for 1.4s, then `copy`. The clipboard API needs HTTPS or `localhost`; on plain `http://` the copy silently does nothing (the label still flips). Two instances on the page (hero + close).

No JS needed for:
- **B callouts:** plain `<a href="#…">` anchors. The target section is highlighted with CSS `:target` and lands below the sticky nav via `scroll-margin-top: 70px`. Pin hover is CSS `:hover`; the pin label is a `title` attribute plus `aria-label`.
- **Working-state pulse:** CSS `@keyframes o2pulse` (2.4s). Turned off by `@media (prefers-reduced-motion: reduce)`, which disables every animation and transition inside `.o2`.
- **Responsive layout:** CSS container queries on `.o2` (`container-type: inline-size`) at 1000px and 760px.
- **Captures:** plain `<img srcset>` 1x/2x with alt text.

No backend, no API calls.

---

## 9. Copy reference

Every visible string, verbatim, grouped by section. Source of truth: `O2` and the components in `observer-shared.jsx` (plus `O2_PINS` for B). **`[DRAFT]` below marks where the page renders the amber DRAFT marker** (tooltip: `founder edits before ship`); keep every one until the founder rewrites the line. Typographic characters (’ “ ” — · ↗ → ≡ ×) are as in the source.

### Nav
- Brand: `$ aidemd.dev/observer`
- Links: `docs` · `brain` · `observer` · `github ↗` · `npm ↗`
- Menu button (≤ 760px): `≡ menu` / `× close`
- Drawer: same five links; on `observer`: `you are here`

### Hero
- Kicker: `# the observer`
- H1: `Monitor every Claude Code session — see which pipeline phase each one is in.` [DRAFT]
- Subhead: `Local. Read-only. One web view across every project on your machine.`
- Pain line: `Several agent sessions open at once, and no way to tell which one is blocked waiting for you — or whether two of them are working in the same project.` [DRAFT]
- Install box: `$` `[INSTALL COMMAND — TO CONFIRM]` — button `copy` / `copied`
- Under it: `then run /aide — the observer starts with it at` `127.0.0.1:24680`
- Facts: `no telemetry` · `no account` · `MIT · open source` · `Windows · macOS · Linux` (each preceded by a green `· `)

### Capture
- Alt text: `The observer’s home view on one machine: billing-service waiting for you at plan approval, acme-api working at build step 3 of 6, mobile-app quiet 25 minutes and marked maybe stuck in QA, docs-site ended.`
- The capture's own pixels read "AIDE Pipeline Viewer". That is the captured app and is left as is; no page copy uses that name.

### B only — callouts (pins on the capture + key list under it)
- `1` `pipeline rail`
- `2` `one live session per project`
- `3` `a session waiting for you`
- `4` `quiet 25 min · maybe stuck`
- Pin accessible names: `callout 1: pipeline rail` … `callout 4: quiet 25 min · maybe stuck`
- Section headings 1–4 below carry the same numbers in circles.

### A only — state legend (aside, `aria-label="state legend"`)
- Title: `states` [DRAFT] (rendered uppercase by CSS)
- `working` — `acting right now`
- `waiting for you` — `stopped; needs you`
- `maybe stuck · quiet 15m` — `quiet over 15 min`
- `ended · 2h ago` — `closed; record kept`
- Separator: `agent replies, not in the observer` (rendered uppercase by CSS)
- `HALT` — `second session in a project`
- `BLOCKED` — `observer couldn’t start`

### The pipeline rail
- Heading: `The pipeline rail`
- Body: `Each session reports where it is in the work: the phase it is in — spec, plan, build, QA, fix — plus approval gates, plan steps checked and QA verdicts.` [DRAFT]
- Rail capture alt: `One pipeline rail: spec, synthesize, plan and plan approval done, research skipped, build running at step 3 of 6, then QA, fix and done pending.`

### One open session per project
- Heading: `One open session per project`
- Body: `Before an agent starts, the observer checks whether another session is open in that project.` [DRAFT]
- Rows:
  - `HALT` — `If one is, it stops with HALT and names that session, what it was doing and how long it’s been quiet. You choose to end it or close the new one.`
  - `end session` — `Ending only marks a session ended. Nothing is deleted.`
  - `BLOCKED` — `If the observer can’t start, BLOCKED stops the session, so nothing runs unobserved.`
- Agent-reply snippet 1 — header `agent reply · session start` + tag `placeholder · real wording from the server`; body:
  ```
  HALT — another session is open in billing-service.
    session  proration-on-plan-change
    state    waiting for you
    quiet    6m
    last     plan approval
  end that session, or close this one.
  ```
- Agent-reply snippet 2 — same header and tag; body:
  ```
  BLOCKED — the observer could not start
  on any port (24680–24689).
  nothing runs unobserved.
  ```
  (`HALT` / `BLOCKED` in red bold.)

### Working, waiting, ended
- Heading: `Working, waiting, ended`
- `working` — `The session started, you sent a prompt, or the agent just ran a tool.`
- `waiting for you` — `The agent stopped and is waiting for you. You see it on the page — the observer doesn’t send notifications.`
- `ended` — `The session ended. Its record stays.`
- [DRAFT] (one marker on its own line under the rows, covering the section)

### How it knows
- Heading: `How it knows`
- Body: `AIDE’s install and upgrade wire` `aidemd-mcp hook` `into Claude Code on five events — no extra config. Hooks give real-time signals that watching session files can’t; they print nothing and never fail or block the agent.` [DRAFT] (`aidemd-mcp hook` is inline code)
- Hook cells: `SessionStart` working · `UserPromptSubmit` working · `PostToolUse` working · `Stop` waiting · `SessionEnd` ended

### Quiet for 15 minutes
- Heading: `Quiet for 15 minutes`
- Body: `A session quiet for more than 15 minutes is marked “maybe stuck”. Quiet isn’t proof of a crash, so it is never ended for being quiet.` [DRAFT]
- Label: `maybe stuck · quiet 15m`

### Local and private
- Heading: `Local and private`
- Body: `It serves on 127.0.0.1 behind an access token, so your session data stays on your machine. No telemetry, no account. It’s read-only: it can’t change a session.` [DRAFT]

### Setup
- Heading: `Setup`
- `port` — `AIDE_OBSERVER_PORT` `if set, else the first free port in` `24680–24689`
- `data root` — `AIDEMD_HOME` `if set, else` / `Windows` `%USERPROFILE%\.aidemd` / `macOS` `~/Library/Application Support/aidemd` / `Linux` `~/.local/state/aidemd`
- Link: `Hooks — full reference in the docs →`

### Close
- Heading: `Start a session with /aide and the observer is there.` [DRAFT]
- Install box repeated: `$` `[INSTALL COMMAND — TO CONFIRM]` `copy` / `then run /aide — the observer starts with it at` `127.0.0.1:24680`

### Footer
- `© 2026 TetsuKodai Group LLC · MIT`
- Links: `docs` · `github ↗` · `npm ↗`

### Canvas only (not on the shipped page)
- Section `/observer v2 — desktop · 1280` — `Product first. Same copy in both; amber DRAFT tags mark lines the founder rewrites. Captures are the real observer in the site theme (assets/observer-capture-aidemd*.png).`
- Section `/observer v2 — mobile · 390` — `Nav collapses to ≡ menu; open state marks observer as the current page.`
- Artboards: `A · Capture-led stack`, `B · Annotated capture`, `A · mobile`, `B · mobile`, `Nav · menu open`

If any of these change after ship, edit `O2` in `observer-shared.jsx`. There's no CMS; the file is the source of truth.

---

## 10. Validation checklist

Before merging:

- [ ] `observer.html` renders at the site root (`https://aidemd.dev/observer` or `/observer.html`) with no console errors and no Babel `Failed to compile`.
- [ ] Network tab: `observer.css`, `observer-shared.jsx`, the chosen variant file and both capture PNGs (1x on standard screens, 2x on retina) return 200.
- [ ] The install placeholder is replaced with the confirmed command in `O2.install`, and no `[INSTALL COMMAND — TO CONFIRM]` remains. The copy button copies it (on HTTPS).
- [ ] Every DRAFT line rewritten by the founder; then every `<Dr />` removed (search `<Dr />` in `observer-shared.jsx`: 10 uses, plus one mention in the header comment). To screenshot without tags meanwhile, add the class `no-draft` to the `.o2` element.
- [ ] HALT / BLOCKED snippet text replaced with the server's real wording, and the `placeholder · real wording from the server` tags removed.
- [ ] Page copy says "the observer" only; "AIDE Pipeline Viewer" appears nowhere in page text (only inside the capture images).
- [ ] HALT and BLOCKED appear only in the agent-reply snippets and their labels, never as an observer screen or capture.
- [ ] `Hooks — full reference in the docs →` reaches the Hooks docs section (200, right anchor).
- [ ] `github ↗` / `npm ↗` point at real targets (nav row, drawer, footer).
- [ ] Nav: `docs · brain · observer · github ↗ · npm ↗`; `observer` is underlined with `aria-current="page"`; the same entry added to `docs-shell.jsx`, `variant-terminal.jsx` (Terminal) and, if shipped with it, the brain page; each link works.
- [ ] At 375–390px: no horizontal page scroll (the rail close-up scrolls sideways inside its own frame), `≡ menu` opens and closes the drawer, `observer` shows `you are here`.
- [ ] At 1280px: layout matches the canvas artboard of the chosen variant.
- [ ] Reduced motion on → the working dot doesn't pulse.
- [ ] (B) Each callout and each key link jumps to its section, the section clears the sticky nav and is highlighted; callouts sit on the right rows of the capture.
- [ ] OG preview renders when the URL is pasted into Slack / iMessage.

---

## 11. Files changed in this handoff

**In this package (zip, flat at the root):**
- `handoff.md` — this file
- `observer.html` — the comparison page (both variants in `<DesignCanvas>`, desktop 1280 + mobile 390 + menu open)
- `observer-shared.jsx` — shared copy, data constants and primitives
- `observer-variant-capture-stack.jsx` — Variant A
- `observer-variant-annotated.jsx` — Variant B
- `observer.css` — page styles
- `design-canvas.jsx` — unchanged, so `observer.html` opens on its own
- `assets/observer-capture-aidemd.png`, `assets/observer-capture-aidemd@2x.png`, `assets/observer-capture-aidemd-rail.png`, `assets/observer-capture-aidemd-rail@2x.png`, `assets/observer-capture-aidemd-session.png` — captures, as uploaded (byte-identical)
- `assets/observer-aidemd-theme.css` — colour source, as uploaded (byte-identical)

**New (site repo):**
- `observer.html` — the new page (template in §4)
- `observer.css` — copied as-is
- `observer-shared.jsx` — copied as-is
- `observer-variant-capture-stack.jsx` — copied as-is (or `observer-variant-annotated.jsx` if shipping B)
- `assets/observer-capture-aidemd.png` + `@2x`, `assets/observer-capture-aidemd-rail.png` + `@2x`

**Modified (site repo):**
- `docs-shell.jsx` — add `observer` to the top-bar nav (§5b)
- `variant-terminal.jsx` (Terminal) — same (§5b)
- `brain-variant-walkthrough.jsx` / `brain-variant-cookbook.jsx` — same, if the brain page ships with this nav (§5b)
- `O2.install`, the docs link and the `#` hrefs inside `observer-shared.jsx` — real values (§7)

**No deletions. No moves. No existing component is structurally changed.**

---

## 12. Out of scope (intentionally)

- **The Hooks docs content.** It ships from the `@aidemd-mcp/server` package. This page only links to it (§7).
- **The landing page** (`Terminal.html` / `variant-terminal.jsx`), apart from adding the `observer` nav entry. That includes its install command, which this page does not reuse.
- **The docs pages**, apart from the nav entry in `docs-shell.jsx`.
- A mobile `≡ menu` drawer on pages other than `/observer`.
- Re-shooting or redrawing the captures. They're used as captured.
- Rewriting the DRAFT copy (founder) and the HALT / BLOCKED wording (comes from the server).

---

## Open items

**DRAFT blocks (founder rewrites; 10 markers, 9 in Variant B, which has no legend):**
1. Hero H1 — `Monitor every Claude Code session — see which pipeline phase each one is in.`
2. Hero pain line — `Several agent sessions open at once…`
3. A only: legend title `states` (covers the legend's notes)
4. The pipeline rail — body
5. One open session per project — body (`Before an agent starts…`)
6. Working, waiting, ended — section-level marker under the rows
7. How it knows — body
8. Quiet for 15 minutes — body
9. Local and private — body
10. Close heading — `Start a session with /aide and the observer is there.`

**Placeholders:**
- `[INSTALL COMMAND — TO CONFIRM]` — hero and close, both variants (one string, `O2.install`); also what the copy button copies.
- HALT agent-reply text and BLOCKED agent-reply text — each tagged `placeholder · real wording from the server` on the page.
- `docs.html#hooks` — the Hooks docs link, until the section ships.
- `github ↗` / `npm ↗` → `#` in the nav row, the mobile drawer and the footer.
- B only: `O2_PINS` positions. The source comment says to "retune once the real capture lands"; the capture in place is the real one, but confirm the pins. On the 1x capture, pins 3 and 4 sit just to the right of the "Waiting on you" and "Quiet 25 min · maybe stuck" chips rather than on them.

**Choices made differently from the brief, or things I couldn't do as asked:**
- **Added `observer.css`** at the package root. The brief's file list has no stylesheet, but every style of the v2 design lives in `observer-v2.css` (unlike /brain, which styles inline). It's exported unchanged apart from its header comment, and loaded by both `observer.html` files. The alternative, inlining ~130 lines into each HTML file, would have made the shipped page diverge from the design source.
- **`<head>` follows `docs.html`** (JetBrains Mono only, `width=device-width`) rather than `Terminal.html`, which loads seven font families the page doesn't use. Pins and SRI hashes are identical in all three. The v2 canvas file's head also had `a{color:#8cc29a} a:hover{color:#ede5d6}`; I dropped it because `.o2 a` overrides it everywhere on the page, so nothing visible changes. Neither colour is in the theme file.
- **`rgba(140,194,154,.07)`** (`#8cc29a`), B's `:target` highlight, isn't a theme value. Left as designed; consider `rgba(106,170,124,.07)` (`#6aaa7c`) if the four-colour rule should be strict.
- **Renamed components** to match the /brain pattern: `ObserverV2Stack` → `ObserverVariantCaptureStack`, `ObserverV2Annotated` → `ObserverVariantAnnotated`. The nav's `observer` link now points at `observer.html` (was `observer-v2.html`). The HALT / BLOCKED snippets were pulled into `AGENT_REPLIES` + `<AgentReply />` so the brief's "agent-reply snippet" is a named shared primitive; rendered output is unchanged. No copy, markup or style differs from the canvas otherwise.
- **Canvas section titles** still read `/observer v2 — …`, transcribed as they are. They're canvas chrome, not page copy.
- **`<title>`, `og:title` and `twitter:title`** (`the observer · AIDEMD.DEV`; canvas: `the observer — variants · AIDEMD.DEV`) aren't on the canvas, so I wrote them. The old v2 title said "aide observer"; I followed the "the observer" naming rule instead. `og:description` reuses the subhead verbatim. All three need sign-off.
- **OG image** is the hero capture, as the v2 design notes decided. It is 1440×1180 rather than 1200×630, so link previews crop it, and it shows "AIDE Pipeline Viewer" in its header. Consider a dedicated 1200×630 card.
- **HALT / BLOCKED** also appear as state labels (with octagon / triangle icons) in the legend under `agent replies, not in the observer` and in the rows of "One open session per project". They aren't shown as observer screens anywhere, and no capture shows them.
- **`RailDemo`** (a drawn rail) is defined in the shared file but rendered by neither variant. It's kept because it was in the design; it can be deleted on ship.
- **`assets/observer-capture-aidemd-session.png`** is included because it matches `observer-capture-aidemd*.png`, but neither variant uses it.
- **Mobile nav on other pages:** none of the existing pages has a collapsing menu, so the "mobile" part of §5 adds `observer` to their existing fixed nav rows only.
- **Not verified in a browser.** The JSX and the canvas script were syntax-checked with Babel, and the copy was diffed against the design source (the only copy change is the install placeholder). The page itself wasn't rendered.
