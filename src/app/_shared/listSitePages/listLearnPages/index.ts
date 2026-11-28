import learnRoster from '@/data/learn';
import type { SitePage } from '@/types/sitePage';
import buildLearnIndexPage from './buildLearnIndexPage';
import buildLearnPage from './buildLearnPage';

/**
 * Lists every /learn page in site order: the /learn index, then one page per
 * roster entry in roster order.
 *
 * Pipeline:
 *   1. Build the /learn index page.
 *   2. Build one answer page per roster entry, in roster order.
 */
export default function listLearnPages(): SitePage[] {
  return [buildLearnIndexPage(), ...learnRoster.map((entry) => buildLearnPage(entry))];
}
