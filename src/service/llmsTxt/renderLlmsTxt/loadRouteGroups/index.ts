import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { DOCS_CATEGORIES, SECTION_INDEX_META } from '@/data/docsCategories';
import { getDocMeta } from '@/service/docsRegistry';
import type { DocRegistry } from '@/types/docs';
import llmsTxtConfig from '@/service/llmsTxt';
import type { LinkEntry, RouteGroup } from '../../types';

/**
 * Parses `.aide/docs/index.md` and returns the slug ordering it defines.
 *
 * The file's bullet list uses the shape `- [label](./slug.md)` or
 * `- [label](slug.md)`.  We strip the `.md` extension and relative-path prefix
 * to get bare slugs.  The methodology `index` slug (the file itself) is not
 * listed inside the file, so we prepend it as position 0.
 *
 * Example return value for the current index.md:
 *   ['index', 'aide-spec', 'aide-template', 'plan-aide', 'todo-aide',
 *    'progressive-disclosure', 'agent-readable-code', 'automated-qa',
 *    'cascading-alignment']
 */
async function loadMethodologySlugOrder(): Promise<string[]> {
  const indexPath = path.resolve(process.cwd(), '.aide/docs/index.md');
  const raw = await readFile(indexPath, 'utf8');

  // Match markdown link hrefs — e.g. `(./aide-spec.md)` or `(aide-spec.md)`
  const slugs: string[] = [];
  const linkRe = /\]\(\.?\/?([^)]+\.md)\)/g;
  let match: RegExpExecArray | null;
  while ((match = linkRe.exec(raw)) !== null) {
    const slug = match[1].replace(/\.md$/, '');
    slugs.push(slug);
  }

  // The index file itself is not listed inside its own bullet list.
  // Per spec the section hub page (index) always sorts first.
  return ['index', ...slugs];
}

/**
 * Groups the DocRegistry routes into one RouteGroup per DOCS_CATEGORIES entry.
 *
 * For the `methodology` section the entries are re-sorted to match the
 * canonical ordering `.aide/docs/index.md` ships (index first, then
 * aide-spec → aide-template → plan-aide → todo-aide → progressive-disclosure
 * → agent-readable-code → automated-qa → cascading-alignment).
 * Routes not present in the index file sort to the end, preserving their
 * registry order relative to each other.
 *
 * The other three sections (commands, agents, skills) keep the registry's
 * deterministic within-section order (index-first, alphabetical).
 *
 * Per-route frontmatter descriptions are fetched in parallel via Promise.all
 * to keep I/O latency low across all four sections.
 *
 * Drift-resistance contract: this function never re-walks the filesystem and
 * never reads a markdown file that docsRegistry has not already registered as
 * a route. Add a file → docsRegistry sees it → loadRouteGroups sees it →
 * llms.txt emits it. No manual step required.
 */
export default async function loadRouteGroups(registry: DocRegistry): Promise<RouteGroup[]> {
  const methodologySlugOrder = await loadMethodologySlugOrder();

  const groups: RouteGroup[] = await Promise.all(
    DOCS_CATEGORIES.map(async (category) => {
      const sectionRoutes = registry.routes.filter((r) => r.section === category.section);

      const entries: LinkEntry[] = await Promise.all(
        sectionRoutes.map(async (route) => {
          const meta = await getDocMeta(route);
          // Take only the first line of the description — some frontmatter descriptions
          // (e.g. agent docs) embed multi-line examples after a `\n\n`. The llmstxt.org
          // bullet format requires a single-line description; the examples are prose for
          // human readers, not for the link-list entry.
          const rawDescription = meta.description ?? '';
          const description = rawDescription.split('\n')[0].trim();
          return {
            title: meta.title,
            absoluteUrl: `${llmsTxtConfig.origin}${route.urlPath}`,
            description,
          };
        }),
      );

      // Re-sort methodology entries to match .aide/docs/index.md canonical order.
      // Other sections keep the registry's deterministic order.
      if (category.section === 'methodology') {
        entries.sort((a, b) => {
          const aSlug = a.absoluteUrl.split('/').pop() ?? '';
          const bSlug = b.absoluteUrl.split('/').pop() ?? '';
          const aIdx = methodologySlugOrder.indexOf(aSlug);
          const bIdx = methodologySlugOrder.indexOf(bSlug);
          const aPos = aIdx === -1 ? Number.MAX_SAFE_INTEGER : aIdx;
          const bPos = bIdx === -1 ? Number.MAX_SAFE_INTEGER : bIdx;
          return aPos - bPos;
        });
      }

      return {
        section: category.section,
        label: SECTION_INDEX_META[category.section].label,
        entries,
      };
    }),
  );

  return groups;
}
