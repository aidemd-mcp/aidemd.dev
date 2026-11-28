import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'node:path';

vi.mock('@/lib/resolveGitDates', () => ({ default: vi.fn() }));
vi.mock('../resolveCommitHash', () => ({ default: vi.fn() }));

import resolveGitDates from '@/lib/resolveGitDates';
import resolveCommitHash from '../resolveCommitHash';
import hydrateRoute from './index';
import type { WalkedDocRoute } from '@/types/docs';

const resolveGitDatesMock = vi.mocked(resolveGitDates);
const resolveCommitHashMock = vi.mocked(resolveCommitHash);

function makeRoute(relPath: string, urlPath: string): WalkedDocRoute {
  return {
    section: 'hooks',
    slug: path.basename(relPath, '.md'),
    title: path.basename(relPath, '.md'),
    urlPath,
    absPath: path.resolve('/repo', relPath),
    order: 0,
  };
}

const indexRoute = makeRoute('.aide/reference/hooks/index.md', '/docs/hooks');

describe('hydrateRoute', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('(i) tracked file — returns the route plus commit and dates, and no markdown body', () => {
    resolveGitDatesMock.mockReturnValue({
      published: '2026-11-26T09:00:00+00:00',
      modified: '2026-11-27T09:00:00+00:00',
    });
    resolveCommitHashMock.mockReturnValue('b75834c');

    const hydrated = hydrateRoute({ route: indexRoute });

    expect(hydrated).toEqual({
      ...indexRoute,
      published: '2026-11-26T09:00:00+00:00',
      modified: '2026-11-27T09:00:00+00:00',
      commit: 'b75834c',
    });
    expect('bodyMarkdown' in hydrated).toBe(false);
  });

  it('(ii) untracked file — carries no published or modified key and the uncommitted marker', () => {
    resolveGitDatesMock.mockReturnValue({});
    resolveCommitHashMock.mockReturnValue('uncommitted');

    const hydrated = hydrateRoute({ route: indexRoute });

    expect('published' in hydrated).toBe(false);
    expect('modified' in hydrated).toBe(false);
    expect(hydrated.commit).toBe('uncommitted');
  });

  it('(iii) shallow history — throws the resolver error and never resolves the commit', () => {
    resolveGitDatesMock.mockImplementation(() => {
      throw new Error('resolveGitDates: repository is shallow — fetch full history');
    });

    expect(() => hydrateRoute({ route: indexRoute })).toThrow(/shallow/);
    expect(resolveCommitHashMock).not.toHaveBeenCalled();
  });
});
