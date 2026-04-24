import { DOCS_CATEGORIES } from '@/data/docsCategories';
import type { DocRoute } from '@/types/docs';

/** Lookup of section → priority index derived from DOCS_CATEGORIES order. */
const SECTION_PRIORITY = new Map(
  DOCS_CATEGORIES.map((cat, i) => [cat.section, i]),
);

/**
 * Sorts routes deterministically and assigns a sequential `order` integer.
 *
 * Sort tiers (ascending):
 *   1. Section priority — follows DOCS_CATEGORIES array order so methodology
 *      routes come before commands, agents, and skills.
 *   2. index.md first — slug === 'index' sorts before all other slugs in its
 *      section so the section root page is always order 0 within the group.
 *   3. Alphabetical slug — stable lexicographic tie-break within the same
 *      section and index-or-not tier.
 *
 * Mutates the input array in place and returns it, which avoids an extra
 * allocation — callers should not rely on the original order after this call.
 */
export default function orderRoutes(routes: DocRoute[]): DocRoute[] {
  routes.sort((a, b) => {
    // Tier 1: section priority.
    const aPriority = SECTION_PRIORITY.get(a.section) ?? Number.MAX_SAFE_INTEGER;
    const bPriority = SECTION_PRIORITY.get(b.section) ?? Number.MAX_SAFE_INTEGER;
    if (aPriority !== bPriority) return aPriority - bPriority;

    // Tier 2: index.md first within its section.
    const aIsIndex = a.slug === 'index' ? 0 : 1;
    const bIsIndex = b.slug === 'index' ? 0 : 1;
    if (aIsIndex !== bIsIndex) return aIsIndex - bIsIndex;

    // Tier 3: alphabetical slug.
    return a.slug.localeCompare(b.slug);
  });

  for (let i = 0; i < routes.length; i++) routes[i].order = i;

  return routes;
}
