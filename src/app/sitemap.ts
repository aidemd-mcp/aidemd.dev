import type { MetadataRoute } from "next";
import path from "node:path";
import buildRegistry from "@/service/docsRegistry";
import resolvePublishedDate from "@/service/docsRegistry/resolvePublishedDate";
import { DOCS_CATEGORIES } from "@/data/docsCategories";
import { LAST_UPDATED as PRIVACY_LAST_UPDATED } from "@/app/privacy/constants";

const BASE = "https://aidemd.dev";

/**
 * Makes `next dev` able to serve /sitemap.xml under `output: "export"`.
 *
 * In dev, Next 14 serves a dynamic sitemap as `/sitemap.xml/[[...__metadata_id__]]`
 * and `output: "export"` demands static params for any dynamic route, so without
 * this export the request fails with a 500. The empty optional catch-all is
 * `/sitemap.xml` itself. Production builds the route statically and ignores this
 * export. `__metadata_id__` is a Next internal: re-check this export, and delete
 * it if it is no longer needed, when upgrading Next.
 */
export function generateStaticParams(): Array<{ __metadata_id__: string[] }> {
  return [{ __metadata_id__: [] }];
}

/**
 * Build-time sitemap covering:
 *   - / (priority 1.0)
 *   - /privacy (priority 0.4)
 *   - /docs/ (priority 0.8)
 *   - one section-index route /docs/{section}/ per DOCS_CATEGORIES entry (priority 0.6)
 *   - every leaf route from the docs registry (priority 0.5)
 *   - /observer/ (no priority; lastModified only from the copy module's git date)
 *
 * Next's metadata-route system serializes this to /sitemap.xml at build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { routes } = await buildRegistry();

  const buildDate = new Date();

  // The observer copy module is the page's content source. resolvePublishedDate
  // returns '' while the file is uncommitted, in which case lastModified is omitted.
  const observerDate = resolvePublishedDate(
    path.join(process.cwd(), "src/app/observer/_data/observerCopy/index.ts"),
  );

  const sectionIndexes: MetadataRoute.Sitemap = DOCS_CATEGORIES.map((cat) => ({
    url: `${BASE}/docs/${cat.urlSegment}/`,
    lastModified: buildDate,
    priority: 0.6,
  }));

  const leafRoutes: MetadataRoute.Sitemap = routes.map((route) => {
    const isoDate = resolvePublishedDate(route.absPath);
    const lastModified = isoDate ? new Date(isoDate) : buildDate;
    // Normalise to trailing slash — next.config.mjs sets trailingSlash: true, so
    // every HTML canonical is emitted with a trailing slash. Sitemap URLs must
    // match those canonicals exactly or crawlers see a mismatch on every leaf
    // route. urlPath values from walkDocsRoot have no trailing slash by default.
    const urlPath = route.urlPath.endsWith("/")
      ? route.urlPath
      : `${route.urlPath}/`;
    return {
      url: `${BASE}${urlPath}`,
      lastModified,
      priority: 0.5,
    };
  });

  return [
    { url: `${BASE}/`, lastModified: buildDate, priority: 1.0 },
    // /privacy canonical is emitted with trailing slash due to trailingSlash: true
    { url: `${BASE}/privacy/`, lastModified: PRIVACY_LAST_UPDATED, priority: 0.4 },
    { url: `${BASE}/docs/`, lastModified: buildDate, priority: 0.8 },
    { url: `${BASE}/brain/`, lastModified: buildDate, priority: 0.7 },
    { url: `${BASE}/brain/recipes/`, lastModified: buildDate, priority: 0.6 },
    observerDate
      ? { url: `${BASE}/observer/`, lastModified: new Date(observerDate) }
      : { url: `${BASE}/observer/` },
    ...sectionIndexes,
    ...leafRoutes,
  ];
}
