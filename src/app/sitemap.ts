import type { MetadataRoute } from "next";
import buildRegistry from "@/service/docsRegistry";
import resolvePublishedDate from "@/service/docsRegistry/resolvePublishedDate";
import { DOCS_CATEGORIES } from "@/data/docsCategories";
import { LAST_UPDATED as PRIVACY_LAST_UPDATED } from "@/app/privacy/constants";

const BASE = "https://aidemd.dev";

/**
 * Build-time sitemap covering:
 *   - / (priority 1.0)
 *   - /privacy (priority 0.4)
 *   - /docs/ (priority 0.8)
 *   - 4 section-index routes /docs/{section}/ (priority 0.6)
 *   - All 33 leaf routes from the docs registry (priority 0.5)
 *
 * Next's metadata-route system serializes this to /sitemap.xml at build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { routes } = await buildRegistry();

  const buildDate = new Date();

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
    ...sectionIndexes,
    ...leafRoutes,
  ];
}
