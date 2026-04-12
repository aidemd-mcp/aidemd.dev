# Implementation Plan — aidemd.dev

## Context

aidemd.dev is the public face and canonical record of the AIDE methodology. It does two jobs: converts a first-time visitor into an installed user of `aidemd-mcp` in a single visit, and serves as the byte-faithful, timestamped, archivable record of the canonical methodology. The site is greenfield — no code exists yet, only `.aide` intent specs. Stack is frozen: Next.js 15 App Router, Tailwind v4, shadcn. Two surfaces only: landing + docs.

**Source specs:** `src/.aide` (root), `src/components/LandingPage/.aide`, `src/components/DocsPage/.aide`, `src/service/docs/renderCanonical/.aide`, `src/service/docs/archive/.aide`, `src/service/install/buildInstallConfig/.aide`.

---

## Phase 0: Project Bootstrap

- [ ] 0.1: Initialize Next.js 15 App Router — `npx create-next-app@latest . --app --ts --tailwind --src-dir --import-alias "@/*"`. No `/pages` directory.
- [ ] 0.2: Initialize shadcn/ui — `npx shadcn@latest init` (new-york style, neutral base, CSS variables, lucide icons).
- [ ] 0.3: Add shadcn primitives: `button`, `card`, `separator`, `tooltip`.
- [ ] 0.4: Verify `tsconfig.json`: `baseUrl: "."`, `paths: { "@/*": ["./src/*"] }`, `strict: true`, `noEmit: true`.
- [ ] 0.5: Verify `postcss.config.mjs` uses `@tailwindcss/postcss` (Tailwind v4).
- [ ] 0.6: No additional dependencies beyond Next.js 15 + Tailwind v4 + shadcn.

---

## Phase 1: Types

**Files to create:**

- [ ] 1.1: Create `src/types/install.ts` — `McpConfig`, `CommandStep`, `InstallConfig` (discriminated union keyed by `framework`)
- [ ] 1.2: Create `src/types/docs.ts` — `CitationMeta`, `CanonicalDoc`, `BuildManifestEntry`, `BuildManifest`
- [ ] 1.3: Create `src/types/feed.ts` — `FeedEntry`

---

## Phase 2: Services

- [ ] 2A: Create `src/service/install/buildInstallConfig/index.ts` — Pure function returning v1 `InstallConfig` constant (MCP JSON + 3-step command sequence)
- [ ] 2B.1: Create `src/service/docs/renderCanonical/index.ts` — Orchestrator: read source -> parse frontmatter -> render markdown -> extract citation meta -> diff check -> return
- [ ] 2B.2: Create helper `readSource/index.ts` — Reads `.aide/<slug>.md` via `node:fs/promises`
- [ ] 2B.3: Create helper `parseFrontmatter/index.ts` — Extracts YAML frontmatter via `gray-matter`
- [ ] 2B.4: Create helper `renderMarkdown/index.ts` — Strict markdown-to-HTML via unified pipeline
- [ ] 2B.5: Create helper `extractCitationMeta/index.ts` — Git history extraction for citation metadata
- [ ] 2B.6: Create helper `diffCheck/index.ts` — Post-render byte-faithfulness verification
- [ ] 2B.7: Install additional deps: `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, `rehype-stringify`, `gray-matter`
- [ ] 2C: Create `src/service/docs/renderHub/index.ts` — Reads `.aide/index.md`, returns ordered `{ slug, title }` list
- [ ] 2D.1: Create `src/service/docs/archive/index.ts` — Orchestrator: Wayback save -> update manifest -> write feed entry -> return
- [ ] 2D.2: Create helper `saveToWayback/index.ts` — Wayback Save Page Now API with 3 retries + exponential backoff
- [ ] 2D.3: Create helper `updateManifest/index.ts` — Append-only `build-manifest.json` updates
- [ ] 2D.4: Create helper `writeFeedEntry/index.ts` — Atom 1.0 feed entry writer

---

## Phase 3: Components — Landing Page

- [ ] 3.1: Create `src/components/shared/CopyButton/index.tsx` — Clipboard copy with visual feedback
- [ ] 3.2: Create `src/components/shared/CodeBlock/index.tsx` — `<pre><code>` with CopyButton
- [ ] 3.3: Create `src/components/shared/InstallFooter/index.tsx` — Reusable install block for landing + docs
- [ ] 3.4: Create `src/components/LandingPage/InstallHero/index.tsx` — Hero with headline, JSON code block, copy button, 3-step sequence
- [ ] 3.5: Create `src/components/LandingPage/TroubleshootingCallout/index.tsx` — 4 friction modes with symptom + fix
- [ ] 3.6: Create `src/components/LandingPage/CostStrip/index.tsx` — Two sourced cost figures
- [ ] 3.7: Create `src/components/LandingPage/HowItWorks/index.tsx` — Pipeline diagram + annotations
- [ ] 3.8: Create `src/components/LandingPage/VsRulesPacks/index.tsx` — AIDE vs flat config files comparison
- [ ] 3.9: Create `src/components/LandingPage/HallucinationEvidence/index.tsx` — Stanford HAI evidence section
- [ ] 3.10: Create `src/components/LandingPage/index.tsx` — Orchestrator composing all 6 beats

---

## Phase 4: Components — Docs Page

- [ ] 4.1: Create `src/components/DocsPage/DocLayout/index.tsx` — Single column, max-width, typography-optimized wrapper
- [ ] 4.2: Create `src/components/DocsPage/DocHeader/index.tsx` — Citation block with dates, SHA, URLs
- [ ] 4.3: Create `src/components/DocsPage/DocToc/index.tsx` — Table of contents from heading structure
- [ ] 4.4: Create `src/components/DocsPage/DocBody/index.tsx` — Renders contentHtml, no injection
- [ ] 4.5: Create `src/components/DocsPage/DocHub/index.tsx` — Hub page rendering `.aide/index.md` link list
- [ ] 4.6: Create `src/components/DocsPage/index.tsx` — Orchestrator composing DocLayout + DocHeader + DocToc + DocBody + InstallFooter

---

## Phase 5: Pages (App Router)

- [ ] 5.1: Create `src/app/layout.tsx` — Root layout with fonts, CSS, Schema.org ld+json, no nav
- [ ] 5.2: Create `src/app/page.tsx` — Landing page, renders LandingPage, static metadata
- [ ] 5.3: Create `src/app/docs/page.tsx` — Docs hub, calls renderHub() at build time
- [ ] 5.4: Create `src/app/docs/[slug]/page.tsx` — Individual doc with generateStaticParams + generateMetadata
- [ ] 5.5: Create `src/app/loading.tsx` and `src/app/error.tsx` — Loading/error states
- [ ] 5.6: Create `src/app/sitemap.ts` — Landing + all doc URLs with git lastModified
- [ ] 5.7: Create `src/app/robots.ts` — Allow all, point to sitemap

---

## Phase 6: Build Pipeline Integration

- [ ] 6.1: Ensure all pages use `generateStaticParams` — no runtime reads of `.aide/` files
- [ ] 6.2: Create `build-manifest.json` at repo root — rendering service reads it for Wayback URLs
- [ ] 6.3: Verify Wayback auth from env vars only — never committed

---

## Phase 7: Tests (co-located, Vitest)

- [ ] 7.1: Create `src/service/install/buildInstallConfig/index.test.ts` — Valid JSON, McpConfig shape, 3-step sequence, no version pinning
- [ ] 7.2: Create `src/service/docs/renderCanonical/index.test.ts` — Byte-faithfulness, frontmatter, citation meta, loud failures
- [ ] 7.3: Create `src/service/docs/renderCanonical/diffCheck/index.test.ts` — Hash matching, divergence throws
- [ ] 7.4: Create `src/service/docs/archive/index.test.ts` — Manifest append-only, feed template, retry logic
- [ ] 7.5: Create `src/service/docs/archive/writeFeedEntry/index.test.ts` — Atom validation, no marketing copy

---

## Explicitly Out of Scope

- No blog, changelog, playground, search, newsletter, pricing, team page, about page, contact form, Discord
- No multi-framework install tabs
- No ActivityPub / Fediverse (v1.1)
- No quarterly re-verification audit (v1.1)
- No CMS or dashboard
- No full-text search

---

## Verification

- [ ] V.1: `npm run build` completes with zero errors — all static pages generated
- [ ] V.2: `npm run dev` — landing page loads with all 6 beats in order, install JSON is valid and copyable
- [ ] V.3: `/docs` renders the hub with correct doc links
- [ ] V.4: `/docs/aide-spec` renders the canonical spec with citation header, byte-faithful content, install footer
- [ ] V.5: `npx vitest run` — all tests green
- [ ] V.6: `tsc --noEmit` — zero type errors
- [ ] V.7: Diff check: copy text from rendered `/docs/aide-spec` content region, compare against `cat .aide/aide-spec.md` — zero semantic differences
