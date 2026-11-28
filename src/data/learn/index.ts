import type { LearnRosterEntry } from "@/types/learn";
import copyBySlug from "./copyBySlug";
import priorityOrder from "./priorityOrder";
import sourcePathBySlug from "./sourcePathBySlug";

/**
 * The one list of /learn pages, in research priority order. Each entry's title
 * and description are read from its copy record, never restated. listSitePages,
 * the llms files, the sitemap and the feed read pages in this order.
 */
const learnRoster: LearnRosterEntry[] = priorityOrder.map((slug) => {
  const copy = copyBySlug[slug];
  return {
    slug,
    title: copy.title,
    description: copy.description,
    urlPath: `/learn/${slug}/`,
    sourcePath: sourcePathBySlug[slug],
  };
});

export default learnRoster;
