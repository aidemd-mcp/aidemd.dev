import { describe, it, expect } from 'vitest';
import type { HistoryChange, HistoryChangeStatus, HistoryCommit } from '@/types/fileHistory';
import findFileHistory from './index';

function makeChange(status: HistoryChangeStatus, path: string, fromPath?: string): HistoryChange {
  return fromPath === undefined ? { status, path } : { status, path, fromPath };
}

function makeCommit({ hash, date, changes }: { hash: string; date: string; changes: HistoryChange[] }): HistoryCommit {
  return { hash, date, changes };
}

describe('findFileHistory', () => {
  it('reports the add date as firstAdded and the modification as lastChanged and lastCommit', () => {
    const commits = [
      makeCommit({ hash: 'bbb', date: '2026-02-01T00:00:00+00:00', changes: [makeChange('M', 'a.md')] }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'a.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'a.md' })).toEqual({
      firstAdded: '2026-01-01T00:00:00+00:00',
      lastChanged: '2026-02-01T00:00:00+00:00',
      lastCommit: 'bbb',
    });
  });

  it('follows one rename back to the original add', () => {
    const commits = [
      makeCommit({ hash: 'ccc', date: '2026-03-01T00:00:00+00:00', changes: [makeChange('M', 'new.md')] }),
      makeCommit({ hash: 'bbb', date: '2026-02-01T00:00:00+00:00', changes: [makeChange('R', 'new.md', 'old.md')] }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'old.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'new.md' })).toEqual({
      firstAdded: '2026-01-01T00:00:00+00:00',
      lastChanged: '2026-03-01T00:00:00+00:00',
      lastCommit: 'ccc',
    });
  });

  it('follows two renames back to the original add', () => {
    const commits = [
      makeCommit({ hash: 'ccc', date: '2026-03-01T00:00:00+00:00', changes: [makeChange('R', 'c.md', 'b.md')] }),
      makeCommit({ hash: 'bbb', date: '2026-02-01T00:00:00+00:00', changes: [makeChange('R', 'b.md', 'a.md')] }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'a.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'c.md' })).toEqual({
      firstAdded: '2026-01-01T00:00:00+00:00',
      lastChanged: '2026-03-01T00:00:00+00:00',
      lastCommit: 'ccc',
    });
  });

  it('counts the rename commit as the last change of the old name', () => {
    const commits = [
      makeCommit({ hash: 'bbb', date: '2026-02-01T00:00:00+00:00', changes: [makeChange('R', 'new.md', 'old.md')] }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'old.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'old.md' })).toMatchObject({
      lastChanged: '2026-02-01T00:00:00+00:00',
      lastCommit: 'bbb',
    });
  });

  it('reports the first add of a file deleted and re-added', () => {
    const commits = [
      makeCommit({ hash: 'ccc', date: '2026-03-01T00:00:00+00:00', changes: [makeChange('A', 'x.md')] }),
      makeCommit({ hash: 'bbb', date: '2026-02-01T00:00:00+00:00', changes: [makeChange('D', 'x.md')] }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'x.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'x.md' })).toEqual({
      firstAdded: '2026-01-01T00:00:00+00:00',
      lastChanged: '2026-03-01T00:00:00+00:00',
      lastCommit: 'ccc',
    });
  });

  it('treats a copy as an add of its new path and does not follow its source', () => {
    const commits = [
      makeCommit({ hash: 'bbb', date: '2026-02-01T00:00:00+00:00', changes: [makeChange('C', 'dst.md', 'src.md')] }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'src.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'dst.md' })).toEqual({
      firstAdded: '2026-02-01T00:00:00+00:00',
      lastChanged: '2026-02-01T00:00:00+00:00',
      lastCommit: 'bbb',
    });
  });

  it('does not count a copy commit as a change of the copy source', () => {
    const commits = [
      makeCommit({ hash: 'bbb', date: '2026-02-01T00:00:00+00:00', changes: [makeChange('C', 'dst.md', 'src.md')] }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'src.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'src.md' })).toEqual({
      firstAdded: '2026-01-01T00:00:00+00:00',
      lastChanged: '2026-01-01T00:00:00+00:00',
      lastCommit: 'aaa',
    });
  });

  it('compares a commit against the name it was reached with and switches names after it', () => {
    const commits = [
      makeCommit({
        hash: 'bbb',
        date: '2026-02-01T00:00:00+00:00',
        changes: [makeChange('R', 'b.md', 'a.md'), makeChange('A', 'a.md')],
      }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'a.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'b.md' }).firstAdded).toBe('2026-01-01T00:00:00+00:00');
  });

  it('skips commits with no changes', () => {
    const commits = [
      makeCommit({ hash: 'ccc', date: '2026-03-01T00:00:00+00:00', changes: [] }),
      makeCommit({ hash: 'bbb', date: '2026-02-01T00:00:00+00:00', changes: [makeChange('M', 'a.md')] }),
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'a.md')] }),
    ];

    expect(findFileHistory({ commits, repoPath: 'a.md' })).toMatchObject({ lastCommit: 'bbb' });
  });

  it('returns no keys for a path no commit touches', () => {
    const commits = [
      makeCommit({ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes: [makeChange('A', 'a.md')] }),
    ];

    const fileHistory = findFileHistory({ commits, repoPath: 'missing.md' });

    expect(fileHistory).toEqual({});
    expect(Object.keys(fileHistory)).toEqual([]);
  });
});
