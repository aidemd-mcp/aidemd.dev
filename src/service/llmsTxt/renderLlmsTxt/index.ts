import path from 'node:path';
import { mkdir, writeFile } from 'node:fs/promises';
import buildRegistry from '@/service/docsRegistry';
import { DOCS_CATEGORIES } from '@/data/docsCategories';
import llmsTxtConfig from '@/service/llmsTxt';
import loadRouteGroups from './loadRouteGroups';
import composeDocument from './composeDocument';
import verifyOutput from './verifyOutput';

/**
 * Render pipeline orchestrator for the llms.txt static asset.
 *
 * This function is the entry point for `npm run llms:render` (wired via
 * `renderLlmsTxt/run.mjs`) and is auto-invoked by the `prebuild` npm hook
 * after `og:render` on every `next build`. It is never imported by the
 * Next.js application graph — docsRegistry filesystem reads and
 * `node:fs/promises` writes stay out of the bundle.
 *
 * Pipeline sequence:
 *   1. `buildRegistry()` — walks the four docs roots and returns the
 *      deterministically-ordered DocRegistry (33 routes today; the count
 *      is not hardcoded anywhere — the registry produces whatever it finds).
 *   2. `loadRouteGroups(registry)` — groups routes by section in
 *      DOCS_CATEGORIES order, enriches each route with title + description
 *      via getDocMeta (cheap frontmatter-only read, no Shiki).
 *   3. `llmsTxtConfig` (imported from the sibling module index) supplies the
 *      static copy: product name, blockquote, preamble paragraphs, origin, and
 *      the output path. No re-invocation required — the config is frozen at
 *      module load.
 *   4. `composeDocument(llmsTxtConfig, groups)` — pure string assembly.
 *      Returns the full UTF-8 document ending in exactly one `\n`.
 *   5. `outPath` is resolved to `<cwd>/public/llms.txt` from the config's
 *      repo-relative `filesystemPath`.
 *   6. `mkdir({ recursive: true })` on the parent dir — defensive guard
 *      against a fresh clone where `public/` has not been created yet.
 *   7. `writeFile(outPath, document, { encoding: 'utf8' })` — atomically
 *      writes the final document.
 *   8. `verifyOutput(outPath, DOCS_CATEGORIES.map(c => c.section))` — reads
 *      the written file, asserts structural and content invariants, and
 *      returns `{ bytes, routeCount }` on success.
 *   9. Single build-log line: `"llms.txt rendered — <routeCount> links,
 *      <bytes> bytes"` so CI output carries the verification result.
 *
 * Any thrown error from a helper bubbles uncaught. The prebuild script
 * propagates the non-zero exit code and aborts `next build`. That is the
 * drift gate — a silently malformed llms.txt never reaches the deploy artifact.
 */
export default async function renderLlmsTxt(): Promise<void> {
  // 1. Build the deterministically-ordered DocRegistry from the four docs roots.
  const registry = await buildRegistry();

  // 2. Enrich each route with title + description; group by section in category order.
  const groups = await loadRouteGroups(registry);

  // 3. llmsTxtConfig is the frozen config object from the sibling module's public surface.
  // (imported at the top of this file — no re-invocation required)

  // 4. Pure string assembly — no I/O; returns the full UTF-8 document.
  const document = composeDocument(llmsTxtConfig, groups);

  // 5. Resolve the output path from the config's repo-relative filesystemPath.
  const outPath = path.resolve(process.cwd(), llmsTxtConfig.filesystemPath);

  // 6. Ensure the parent directory exists — guards against a fresh clone where public/ is absent.
  await mkdir(path.dirname(outPath), { recursive: true });

  // 7. Write the document to disk.
  await writeFile(outPath, document, { encoding: 'utf8' });

  // 8. Verify structural invariants and content gates; returns metrics on success.
  const metrics = await verifyOutput(outPath, DOCS_CATEGORIES.map((c) => c.section));

  // 9. One build-log line so CI output carries the verification result.
  console.log(`llms.txt rendered — ${metrics.routeCount} links, ${metrics.bytes} bytes`);
}
