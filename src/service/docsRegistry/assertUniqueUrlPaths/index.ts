import type { WalkedDocRoute } from '@/types/docs';

/**
 * Fails the build when two docs map to the same URL. Lowercasing slugs into
 * urlPaths can collapse two files that differ only by case (`Stop.md` and
 * `stop.md`) onto one URL; a silent overwrite would drop a doc, so the
 * registry must fail loudly instead.
 */
export default function assertUniqueUrlPaths(routes: readonly WalkedDocRoute[]): void {
  const absPathByUrlPath = new Map<string, string>();

  for (const route of routes) {
    const firstAbsPath = absPathByUrlPath.get(route.urlPath);
    if (firstAbsPath !== undefined) {
      throw new Error(
        `docsRegistry: two docs map to the same URL ${route.urlPath} — ${firstAbsPath} and ${route.absPath} differ only by case; rename one`,
      );
    }
    absPathByUrlPath.set(route.urlPath, route.absPath);
  }
}
