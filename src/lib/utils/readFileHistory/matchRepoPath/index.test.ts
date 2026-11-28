import { describe, it, expect } from 'vitest';
import type { HistoryChange, HistoryChangeStatus, HistoryCommit } from '@/types/fileHistory';
import matchRepoPath from './index';

function makeChange(status: HistoryChangeStatus, path: string, fromPath?: string): HistoryChange {
  return fromPath === undefined ? { status, path } : { status, path, fromPath };
}

function makeCommits(...changes: HistoryChange[]): HistoryCommit[] {
  return [{ hash: 'aaa', date: '2026-01-01T00:00:00+00:00', changes }];
}

describe('matchRepoPath', () => {
  it('returns an exact match unchanged', () => {
    const commits = makeCommits(makeChange('A', 'docs/Stop.md'));

    expect(matchRepoPath({ repoPath: 'docs/Stop.md', commits, ignoreCase: true })).toBe('docs/Stop.md');
  });

  it('returns git spelling when only the letter case differs and ignoreCase is true', () => {
    const commits = makeCommits(makeChange('A', 'docs/Stop.md'));

    expect(matchRepoPath({ repoPath: 'Docs/Stop.md', commits, ignoreCase: true })).toBe('docs/Stop.md');
  });

  it('returns the path unchanged when ignoreCase is false', () => {
    const commits = makeCommits(makeChange('A', 'docs/Stop.md'));

    expect(matchRepoPath({ repoPath: 'Docs/Stop.md', commits, ignoreCase: false })).toBe('Docs/Stop.md');
  });

  it('does not guess between two spellings that differ only by case', () => {
    const commits = makeCommits(makeChange('A', 'docs/a.md'), makeChange('A', 'docs/A.md'));

    expect(matchRepoPath({ repoPath: 'DOCS/A.MD', commits, ignoreCase: true })).toBe('DOCS/A.MD');
  });

  it('returns the path unchanged when history has no spelling of it', () => {
    const commits = makeCommits(makeChange('A', 'docs/other.md'));

    expect(matchRepoPath({ repoPath: 'docs/missing.md', commits, ignoreCase: true })).toBe('docs/missing.md');
  });

  it('counts a path found only as a rename fromPath as an exact match', () => {
    const commits = makeCommits(makeChange('R', 'docs/new.md', 'docs/Old.md'), makeChange('A', 'docs/old.md'));

    expect(matchRepoPath({ repoPath: 'docs/Old.md', commits, ignoreCase: true })).toBe('docs/Old.md');
  });
});
