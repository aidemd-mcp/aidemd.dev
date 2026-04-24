import type { MetadataRoute } from "next";
import buildRegistry from "@/service/docsRegistry";
import { DOCS_CATEGORIES } from "@/data/docsCategories";

const BASE = "https://aidemd.dev";

/**
 * Build-time sitemap covering:
 *   - / (priority 1.0)
 *   - /docs/ (priority 0.8)
 *   - 4 section-index routes /docs/{section}/ (priority 0.6)
 *   - All 33 leaf routes from the docs registry (priority 0.5)
 *
 * Next's metadata-route system serializes this to /sitemap.xml at build time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { routes } = await buildRegistry();

  const sectionIndexes: MetadataRoute.Sitemap = DOCS_CATEGORIES.map((cat) => ({
    url: `${BASE}/docs/${cat.urlSegment}/`,
    priority: 0.6,
  }));

  const leafRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${BASE}${route.urlPath}`,
    priority: 0.5,
  }));

  return [
    { url: `${BASE}/`, priority: 1.0 },
    { url: `${BASE}/docs/`, priority: 0.8 },
    ...sectionIndexes,
    ...leafRoutes,
  ];
}
