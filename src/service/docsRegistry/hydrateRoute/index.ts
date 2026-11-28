import resolveGitDates from '@/lib/resolveGitDates';
import type { DocRoute, WalkedDocRoute } from '@/types/docs';
import resolveCommitHash from '../resolveCommitHash';

/**
 * Attaches the version-history facts every downstream surface reads from the
 * route (commit, true published and modified dates), so no surface shells out
 * to git itself. The markdown body is not attached here; it is produced on
 * demand by `renderDocMarkdown`.
 *
 * The date resolver runs first: it throws on a shallow or failed history, and
 * that failure must stop the build before `resolveCommitHash` can swallow the
 * same condition into a silent `uncommitted`. The dates object is spread, so
 * an untracked file keeps no `published` or `modified` key at all.
 */
export default function hydrateRoute({ route }: { route: WalkedDocRoute }): DocRoute {
  const dates = resolveGitDates(route.absPath);
  const commit = resolveCommitHash(route.absPath);

  return { ...route, ...dates, commit };
}
