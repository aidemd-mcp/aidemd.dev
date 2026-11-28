import path from 'node:path';
import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:child_process', () => ({
  execFileSync: vi.fn(),
}));

import { execFileSync } from 'node:child_process';

const mockExecFileSync = execFileSync as ReturnType<typeof vi.fn>;

const REPO_ROOT = path.resolve('/repo');

/** One commit as git prints it: record separator, hash, unit separator, date, then the change fields each ended by NUL. */
function makeRecord(hash: string, date: string, fields: string[] = []): string {
  const header = `\x1e${hash}\x1f${date}\0`;
  if (fields.length === 0) return header;
  return `${header}\n${fields.map((field) => `${field}\0`).join('')}`;
}

const FIXTURE_LOG =
  makeRecord('ccc3333', '2026-03-03T10:00:00+01:00', ['M', 'docs/new.md', 'M', 'docs/tracked.md']) +
  makeRecord('bbb2222', '2026-02-02T10:00:00+01:00', ['R100', 'docs/old.md', 'docs/new.md']) +
  makeRecord('aaa1111', '2026-01-01T09:00:00+01:00', ['A', 'docs/old.md', 'A', 'docs/tracked.md']);

/** Answers rev-parse with the repo root and log with the fixture, or with whatever `logResult` throws or returns. */
function scriptGit(logResult: () => string = () => FIXTURE_LOG): void {
  mockExecFileSync.mockImplementation((_file: string, args: string[]) => {
    if (args[0] === 'rev-parse') return `${REPO_ROOT}\n`;
    if (args[0] === 'log') return logResult();
    throw new Error(`unexpected git call: ${args.join(' ')}`);
  });
}

async function loadReader(): Promise<(absPath: string) => import('@/types/fileHistory').FileHistory> {
  vi.resetModules();
  return (await import('./index')).default;
}

function logCalls(): unknown[][] {
  return mockExecFileSync.mock.calls.filter((call) => call[1][0] === 'log');
}

describe('readFileHistory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockExecFileSync.mockReset();
  });

  it('reads history once for 50 different paths', async () => {
    scriptGit();
    const readFileHistory = await loadReader();

    const paths = ['docs/tracked.md', 'docs/new.md', ...Array.from({ length: 48 }, (_, i) => `docs/untracked-${i}.md`)];
    expect(new Set(paths).size).toBe(50);
    for (const relative of paths) readFileHistory(path.resolve(REPO_ROOT, relative));

    expect(mockExecFileSync).toHaveBeenCalledTimes(2);
    expect(logCalls()).toHaveLength(1);
  });

  it('runs the pinned log arguments with the raised buffer', async () => {
    scriptGit();
    const readFileHistory = await loadReader();

    readFileHistory(path.resolve(REPO_ROOT, 'docs/tracked.md'));

    expect(logCalls()[0]).toEqual([
      'git',
      ['log', '-z', '--root', '-M', '--diff-merges=off', '--name-status', '--format=%x1e%h%x1f%aI'],
      { encoding: 'utf8', maxBuffer: 67108864 },
    ]);
  });

  it('answers a tracked file from the fixture', async () => {
    scriptGit();
    const readFileHistory = await loadReader();

    expect(readFileHistory(path.resolve(REPO_ROOT, 'docs/tracked.md'))).toEqual({
      firstAdded: '2026-01-01T09:00:00+01:00',
      lastChanged: '2026-03-03T10:00:00+01:00',
      lastCommit: 'ccc3333',
    });
  });

  it('follows a rename end to end', async () => {
    scriptGit();
    const readFileHistory = await loadReader();

    expect(readFileHistory(path.resolve(REPO_ROOT, 'docs/new.md'))).toEqual({
      firstAdded: '2026-01-01T09:00:00+01:00',
      lastChanged: '2026-03-03T10:00:00+01:00',
      lastCommit: 'ccc3333',
    });
  });

  it('answers {} with no keys for a file the history never mentions', async () => {
    scriptGit();
    const readFileHistory = await loadReader();

    const answer = readFileHistory(path.resolve(REPO_ROOT, 'docs/never.md'));

    expect(answer).toEqual({});
    expect(Object.keys(answer)).toHaveLength(0);
  });

  it('answers the same path twice without another git call', async () => {
    scriptGit();
    const readFileHistory = await loadReader();
    const absPath = path.resolve(REPO_ROOT, 'docs/tracked.md');

    const first = readFileHistory(absPath);
    const callsAfterFirst = mockExecFileSync.mock.calls.length;
    const second = readFileHistory(absPath);

    expect(second).toEqual(first);
    expect(mockExecFileSync.mock.calls.length).toBe(callsAfterFirst);
  });

  it('throws naming the path when it is outside the repository', async () => {
    scriptGit();
    const readFileHistory = await loadReader();
    const outside = path.resolve('/elsewhere/a.md');

    expect(() => readFileHistory(outside)).toThrow(/^readFileHistory: .*a\.md/);
  });

  it('throws when log fails and tries the read again on the next call', async () => {
    let failing = true;
    scriptGit(() => {
      if (failing) throw new Error('spawnSync git ENOBUFS');
      return FIXTURE_LOG;
    });
    const readFileHistory = await loadReader();
    const absPath = path.resolve(REPO_ROOT, 'docs/tracked.md');

    expect(() => readFileHistory(absPath)).toThrow(/^readFileHistory: git log .* failed: spawnSync git ENOBUFS/);

    failing = false;
    expect(readFileHistory(absPath).lastCommit).toBe('ccc3333');
    expect(logCalls()).toHaveLength(2);
  });
});
