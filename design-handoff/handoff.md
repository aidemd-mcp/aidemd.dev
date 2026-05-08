# Handoff — `brain.aide` author guide page

**Target:** add a new `/brain` page to the existing AIDEMD.DEV site — a long-form guide for developers who want to wire (or author) a brain backend.
**Status:** additive. New page + nav entries on existing pages. No existing component changes.
**Source design:** `brain.html` in this project. It uses the design-canvas to show **two variants side-by-side**. Pick one before integrating — see §1.

---

## 1. Pick a variant — required before integration

`brain.html` exposes two takes on the same content. They share the same primitives (`brain-shared.jsx`) and the same copy where copy is the same; the difference is structure.

|                         | Variant A — Walkthrough                            | Variant B — Cookbook                               |
| ----------------------- | -------------------------------------------------- | -------------------------------------------------- |
| Source file             | `brain-variant-walkthrough.jsx`                    | `brain-variant-cookbook.jsx`                       |
| Shape                   | Single linear scroll, numbered §01–§05             | 3-column: rail / recipe / sticky live generator    |
| Best for                | First-time readers; "I just want to wire Obsidian" | Returning developers; "where's the Notion recipe?" |
| Live skeleton generator | At the bottom of §05 (`<SkeletonGenerator />`)     | Sticky in the right rail (`<SkeletonCompact />`)   |
| Width                   | 1280 design width                                  | 1480 design width (3-col needs the room)           |

**Default recommendation:** ship **A (Walkthrough)**. It reads cleanly at any width, matches the linear feel of the rest of the site, and the cookbook tab navigation depends on enough JS state that it's worth keeping out of the marketing surface.

The rest of this handoff assumes A. To swap to B, follow the **Variant B substitutions** callouts at each step — they're inline.

---

## 2. What to ship

A new public page at `/brain` (file: `brain.html` at the site root, sibling to `Terminal.html` and `docs.html`).

```
brain.html                       ← new page
brain-shared.jsx                 ← copy as-is
brain-variant-walkthrough.jsx    ← copy as-is  (Variant A)
# Variant B substitution: copy brain-variant-cookbook.jsx instead
```

That's it. No new build step, no bundler changes — same inline-Babel approach as the rest of the site.

---

## 3. Source files to copy

Copy these from this project to the site, preserving filenames:

| From (this project)                       | To (site)                       | Notes                                                                          |
| ----------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------ |
| `brain-shared.jsx`                        | `brain-shared.jsx`              | Shared primitives + the `BACKEND_PRESETS` data. **Required** by both variants. |
| `brain-variant-walkthrough.jsx`           | `brain-variant-walkthrough.jsx` | Variant A. The full page body.                                                 |
| _(optional)_ `brain-variant-cookbook.jsx` | `brain-variant-cookbook.jsx`    | Variant B. Only if you ship B.                                                 |

**Do not** copy `design-canvas.jsx` — it's only the comparison harness on `brain.html` in this project. The shipped page renders the variant directly, fullscreen.

**Do not** copy `brain.html` from this project verbatim — it wraps both variants in a `<DesignCanvas>`. Use the new-file template in §4 instead.

---

## 4. The new `brain.html` (site version)

Create this at the site root. It mirrors the `<head>` of `Terminal.html` / `docs.html` (same fonts, same React/Babel pins) and renders the chosen variant fullscreen.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>brain.aide — wire any backend as a brain · AIDEMD.DEV</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap"
      rel="stylesheet"
    />
    <style>
      html,
      body {
        margin: 0;
        padding: 0;
        background: #0d0b08;
      }
      body {
        font-family: "JetBrains Mono", monospace;
      }
      * {
        box-sizing: border-box;
      }
    </style>

    <!-- React / Babel — same pins as the rest of the site -->
    <script
      src="https://unpkg.com/react@18.3.1/umd/react.development.js"
      integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
      integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm"
      crossorigin="anonymous"
    ></script>
    <script
      src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
      integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y"
      crossorigin="anonymous"
    ></script>

    <!-- OG tags — point at the same canonical og.png; override title/desc only -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="AIDEMD.DEV" />
    <meta property="og:url" content="https://aidemd.dev/brain" />
    <meta
      property="og:title"
      content="brain.aide — wire any backend as a brain"
    />
    <meta
      property="og:description"
      content="A guide for backend authors. Wire the bundled Obsidian default, then learn how to author your own brain plugin."
    />
    <meta property="og:image" content="https://aidemd.dev/og.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta
      name="twitter:title"
      content="brain.aide — wire any backend as a brain"
    />
    <meta name="twitter:description" content="A guide for backend authors." />
    <meta name="twitter:image" content="https://aidemd.dev/og.png" />
  </head>
  <body>
    <div id="root"></div>

    <script type="text/babel" src="brain-shared.jsx"></script>
    <script type="text/babel" src="brain-variant-walkthrough.jsx"></script>
    <!-- Variant B substitution: replace the line above with: -->
    <!-- <script type="text/babel" src="brain-variant-cookbook.jsx"></script> -->

    <script type="text/babel">
      ReactDOM.createRoot(document.getElementById("root")).render(
        <BrainVariantWalkthrough />,
      );
      // Variant B substitution: render <BrainVariantCookbook /> instead.
    </script>
  </body>
</html>
```

**Why no design-canvas wrapper?** The canvas is a multi-option comparison tool used only during design review. End users get the chosen variant directly, full viewport.

---

## 5. Site nav — add a `/brain` link

The brain page needs to be discoverable from the existing nav. Two changes:

### 5a. Top-bar nav (every page that has one)

Both variants render their own top bar (`home · docs · github ↗`). They already match the existing site bar. **No change needed inside the variant files.**

But the existing `Terminal.html` and `docs-shell.jsx` top bars currently link only `home` and `docs` (+ external links). Add a `brain` entry between them. In `docs-shell.jsx`, the relevant block is around line 41–45:

```jsx
<span
  style={{
    marginLeft: "auto",
    fontSize: 11,
    color: p.dim,
    display: "flex",
    gap: 20,
  }}
>
  <a href="Terminal.html" style={{ color: "inherit", textDecoration: "none" }}>
    home
  </a>
  <a href="brain.html" style={{ color: "inherit", textDecoration: "none" }}>
    brain
  </a>{" "}
  {/* ← add */}
  <a href="docs.html" style={{ color: "inherit", textDecoration: "none" }}>
    docs
  </a>{" "}
  {/* ← add if not present */}
  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
    github ↗
  </a>
  <a href="#" style={{ color: "inherit", textDecoration: "none" }}>
    npm ↗
  </a>
</span>
```

Make the equivalent edit on `Terminal.html` and any other top-level page with a nav.

Inside the brain variants the top bar reads `home · docs · github ↗`. If you'd like consistency, edit the top bar in `brain-variant-walkthrough.jsx` (and/or `brain-variant-cookbook.jsx`) to add a `brain` self-link with the active style — but it's optional, since the brain page is the destination.

### 5b. Docs sidebar — link to brain.aide spec already exists

The `docs/brain-aide.md` page exists at `docs-brain-aide.html`. The Walkthrough's footer ("the spec" card) already points at it via `href="docs-brain-aide.html"`. Verify that file is present at the site root with the same name; if it lives elsewhere (e.g. `docs/brain-aide.html`), update the `FooterCard href` in `brain-variant-walkthrough.jsx` accordingly. Same applies for the cookbook's "RELATED" rail link.

### 5c. Reverse link — from `docs-brain-aide.html` to the guide

Add a one-liner near the top of `docs-brain-aide.html`:

```html
<!-- inside the docs page header area -->
<a href="brain.html" style="color: #3d6b4a; text-decoration: none;"
  >→ tutorial: wire your own backend</a
>
```

This catches users who land on the spec and want the guided version.

---

## 6. Tokens — colors, fonts, spacing

All values come from `BRAIN_PAL` in `brain-shared.jsx`. They mirror the existing site palette (`DOCS_PAL` in `docs-shell.jsx`) — same `bg`, `fg`, `accent`, `border`, `mono`. The brain-specific additions are:

```
accent2   #7aa6d6     (cool blue — currently unused, reserved for future link variants)
warn      #d6b25a     (yellow — used on the "WHY THE STOP" callout and YAML-null highlights)
bad       #c25a3a     (red — used on the "no-brain-aide" boot state)
good      #8cbe5a     (green — used on "ok" boot state and seeded-success bubble)
```

If the rest of the site eventually adopts these as semantic tokens, lift them into `DOCS_PAL` and re-export from `brain-shared.jsx` — but for this handoff they live alongside, no rename needed.

**Font:** `JetBrains Mono` 400/500/600/700 — already loaded site-wide. No new font work.

---

## 7. External links to verify

Both variants reference these URLs as `href="#"` placeholders. Replace with real targets before deploy:

| Where                                           | Currently | Should be                             |
| ----------------------------------------------- | --------- | ------------------------------------- |
| Walkthrough top bar `github ↗`                  | `#`       | `https://github.com/<org>/aidemd-mcp` |
| Walkthrough footer "the source" card            | `#`       | same as above                         |
| Walkthrough footer `github ↗ · npm ↗ · discuss` | `#`       | repo / npm package / discussion forum |
| Cookbook top bar + footer                       | same set  | same                                  |

The Obsidian reference implementation is referenced by name (`@bitbonsai/mcpvault`) inside the live skeleton output. That's the npm package name — no link replacement needed there.

---

## 8. Functional dependencies (things to test)

The page is interactive. Three pieces have JS state — verify each works after deploy:

1. **Skeleton generator** (`<SkeletonGenerator />` in A, `<SkeletonCompact />` in B)
   - Click each preset (`obsidian` / `filesystem` / `notion`) → frontmatter + orientation regenerate.
   - Click the `⧉ copy` chip → file content lands on clipboard. (Requires HTTPS or `localhost`; clipboard API silently no-ops on plain `http://`.)
   - "override orientation" checkbox (A only) → reveals textarea, edits flow through to preview.

2. **Config flow visualizer** (`<ConfigFlow />` — used in §02 of A and recipe `flow` in B)
   - Three buttons toggle which column is highlighted (`WIRING flow` / `SEEDING flow` / both → success bubble).
   - The "after restart + seed" state shows a green confirmation card.

3. **Worked-examples tabs** (A only — `<WorkedExamples />` in §05)
   - `filesystem` / `notion` / `obsidian` tabs swap blurb + tools + frontmatter + orientation.

4. **Recipe rail** (B only)
   - 8 recipes in the left rail; clicking sets which `<RecipeBody>` renders. Active state has a green left-border.

No backend, no API calls. All three pieces are pure React state.

---

## 9. Copy reference (key strings, in case anything drifts)

So your agent can spot-check the deploy against the design source:

| Slot             | Copy                                                                                                                                         |
| ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Page title       | `brain.aide — wire any backend as a brain`                                                                                                   |
| Hero (A)         | `wire any backend / as a brain.` (second line dimmed)                                                                                        |
| Hero subhead (A) | "The brain.aide file is a plugin interface. It tells AIDE how to launch your storage backend over MCP and how to talk to it once it's live…" |
| Hero (B)         | `recipes for the brain plugin interface.`                                                                                                    |
| Section §01      | `install + scaffold the default`                                                                                                             |
| Section §02      | `wire it: /aide:brain config`                                                                                                                |
| Section §03      | `seed the entry-point artifacts`                                                                                                             |
| Section §04      | `verify with the boot reporter`                                                                                                              |
| Section §05      | `build your own backend`                                                                                                                     |
| Footer (both)    | `© 2026 TetsuKodai Group LLC · ● brain plugin interface`                                                                                     |

If any of these change on the marketing site after ship, edit them in the variant `.jsx` source — there's no CMS, the file is the source of truth.

---

## 10. Validation checklist

Before merging:

- [ ] `brain.html` renders at site root (`https://aidemd.dev/brain` or `/brain.html`) without console errors.
- [ ] All three variant files (`brain-shared.jsx` + chosen variant) load — DevTools Network tab shows 200s.
- [ ] React hydrates (no `Failed to compile` Babel errors in console).
- [ ] Top-bar `home` link returns to `Terminal.html`.
- [ ] Footer "the spec" / "RELATED" link reaches `docs-brain-aide.html` (200, not 404).
- [ ] Skeleton generator: pick `notion` → output shows `--token` and `--root` arg lines with two YAML nulls.
- [ ] Config flow: clicking "after restart + seed" reveals the green ✓ bubble.
- [ ] Top-bar nav of `Terminal.html` and `docs.html` now includes a `brain` link, and it works.
- [ ] OG preview renders correctly when the URL is pasted into Slack / iMessage (uses the existing `og.png`).
- [ ] Page is responsive at 1280px+. Below 1280px, horizontal scroll is acceptable (matches the rest of the site, which uses `viewport width=1400`); if you'd like a real mobile pass, that's a follow-up — out of scope here.

---

## 11. Files changed in this handoff

**New (site repo):**

- `brain.html` — the new page
- `brain-shared.jsx` — copied as-is from this project
- `brain-variant-walkthrough.jsx` — copied as-is (or `brain-variant-cookbook.jsx` if shipping B)

**Modified (site repo):**

- `docs-shell.jsx` — add `<a href="brain.html">brain</a>` to top-bar nav (§5a)
- `Terminal.html` — same nav addition (§5a)
- `docs-brain-aide.html` — add reverse link to the guide (§5c)
- External `href="#"` placeholders inside the chosen variant — replace with real URLs (§7)

**No deletions. No moves. No existing component is structurally changed.**

---

## 12. Out of scope (intentionally)

- Mobile-specific layout. Both variants assume desktop widths, same as the rest of the site.
- Per-recipe deep links (`/brain#notion`). The cookbook recipe rail is local React state, not URL-routed. If you want shareable recipe URLs, that's a follow-up.
- Search across recipes / a docs-style search box.
- The `npm ↗` and `github ↗` _destinations_ — handoff §7 just notes the substitution; picking the canonical URLs is a marketing decision, not an integration step.
