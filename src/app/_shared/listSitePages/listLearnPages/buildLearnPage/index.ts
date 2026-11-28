import path from 'node:path';
import copyBySlug from '@/data/learn/copyBySlug';
import templateLabels from '@/data/learn/templateLabels';
import resolveGitDates from '@/lib/resolveGitDates';
import type { LearnRosterEntry } from '@/types/learn';
import type { SitePage } from '@/types/sitePage';
import attachOgImage from '../../shared/attachOgImage';
import toMarkdownUrl from '../../shared/toMarkdownUrl';

/**
 * One /learn answer page record. Title and description come from the roster
 * entry; the breadcrumb tail is the record's h1. `published` / `modified` come
 * from the version history of the page's copy module and are copied only when
 * history proved them. A throw from resolveGitDates (shallow or failed
 * history) is not caught: it must fail the build.
 */
export default function buildLearnPage(entry: LearnRosterEntry): SitePage {
  const copy = copyBySlug[entry.slug];
  const dates = resolveGitDates(path.resolve(process.cwd(), entry.sourcePath));
  return attachOgImage({
    urlPath: entry.urlPath,
    kind: 'learn',
    title: entry.title,
    description: entry.description,
    section: 'learn',
    markdownUrl: toMarkdownUrl(entry.urlPath),
    breadcrumb: [
      { name: templateLabels.breadcrumbHome, urlPath: '/' },
      { name: templateLabels.breadcrumbLearn, urlPath: '/learn/' },
      { name: copy.h1, urlPath: entry.urlPath },
    ],
    ...(dates.published !== undefined && { published: dates.published }),
    ...(dates.modified !== undefined && { modified: dates.modified }),
  });
}
