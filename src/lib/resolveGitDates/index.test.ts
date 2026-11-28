import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:child_process', () => ({
  execSync: vi.fn(),
}));

vi.mock('@/lib/utils/readFileHistory', () => ({
  default: vi.fn(),
}));

import { execSync } from 'node:child_process';
import readFileHistory from '@/lib/utils/readFileHistory';
import type { FileHistory } from '@/types/fileHistory';

const execSyncMock = vi.mocked(execSync);
const readFileHistoryMock = vi.mocked(readFileHistory);

const SHALLOW_COMMAND = 'git rev-parse --is-shallow-repository';

/** Scripts the shallow check's execSync answer; any other git command is a test failure. */
function scriptShallow(answer: string): void {
  execSyncMock.mockImplementation(((command: string) => {
    if (command === SHALLOW_COMMAND) return answer;
    throw new Error(`unexpected git command: ${command}`);
  }) as unknown as typeof execSync);
}

/** Scripts the one history read to answer every path with the same facts. */
function scriptHistory(history: FileHistory): void {
  readFileHistoryMock.mockReturnValue(history);
}

/** Loads a fresh module so the per-process memoization starts empty. */
async function loadResolveGitDates() {
  vi.resetModules();
  const module = await import('./index');
  return module.default;
}

beforeEach(() => {
  vi.clearAllMocks();
  scriptShallow('false\n');
});

describe('resolveGitDates', () => {
  it('returns published and modified from the history, without lastCommit, for a tracked file', async () => {
    scriptHistory({
      firstAdded: '2026-01-02T07:00:00+00:00',
      lastChanged: '2026-11-20T10:00:00+00:00',
      lastCommit: 'abc1234',
    });
    const resolveGitDates = await loadResolveGitDates();

    expect(resolveGitDates('/repo/src/data/a.md')).toEqual({
      published: '2026-01-02T07:00:00+00:00',
      modified: '2026-11-20T10:00:00+00:00',
    });
  });

  it('returns an empty object with no date keys for an untracked file', async () => {
    scriptHistory({});
    const resolveGitDates = await loadResolveGitDates();

    const dates = resolveGitDates('/repo/src/data/new.md');

    expect(dates).toEqual({});
    expect(Object.keys(dates)).toEqual([]);
  });

  it('returns only modified, with no published key, when only the last change is known', async () => {
    scriptHistory({ lastChanged: '2026-11-20T10:00:00+00:00' });
    const resolveGitDates = await loadResolveGitDates();

    const dates = resolveGitDates('/repo/src/data/a.md');

    expect(dates).toEqual({ modified: '2026-11-20T10:00:00+00:00' });
    expect(Object.keys(dates)).toEqual(['modified']);
  });

  it('throws the shallow-clone message and never reads history on a shallow repository', async () => {
    scriptShallow('true\n');
    scriptHistory({ firstAdded: '2026-01-02T07:00:00+00:00' });
    const resolveGitDates = await loadResolveGitDates();

    expect(() => resolveGitDates('/repo/src/data/a.md')).toThrow(
      'resolveGitDates: the repository is a shallow clone, so version-history dates would be wrong. Fetch full history (actions/checkout with fetch-depth: 0, or git fetch --unshallow) and rebuild.',
    );
    expect(readFileHistoryMock).not.toHaveBeenCalled();
  });

  it('checks the shallow flag once across two different paths', async () => {
    scriptHistory({ lastChanged: '2026-11-20T10:00:00+00:00' });
    const resolveGitDates = await loadResolveGitDates();

    resolveGitDates('/repo/src/data/a.md');
    resolveGitDates('/repo/src/data/b.md');

    expect(execSyncMock).toHaveBeenCalledTimes(1);
    expect(execSyncMock).toHaveBeenCalledWith(SHALLOW_COMMAND, {
      encoding: 'utf8',
    });
  });

  it('reads history once and returns identical results for the same path twice', async () => {
    scriptHistory({
      firstAdded: '2026-01-02T07:00:00+00:00',
      lastChanged: '2026-11-20T10:00:00+00:00',
    });
    const resolveGitDates = await loadResolveGitDates();

    const first = resolveGitDates('/repo/src/data/a.md');
    const second = resolveGitDates('/repo/src/data/a.md');

    expect(second).toEqual(first);
    expect(readFileHistoryMock).toHaveBeenCalledTimes(1);
    expect(readFileHistoryMock).toHaveBeenCalledWith('/repo/src/data/a.md');
  });

  it('throws a resolveGitDates-prefixed error naming the path when the history read fails', async () => {
    readFileHistoryMock.mockImplementation(() => {
      throw new Error('readFileHistory: fatal: outside repository');
    });
    const resolveGitDates = await loadResolveGitDates();

    expect(() => resolveGitDates('/elsewhere/file.md')).toThrow(
      /^resolveGitDates: .*\/elsewhere\/file\.md.*fatal: outside repository/,
    );
  });
});
