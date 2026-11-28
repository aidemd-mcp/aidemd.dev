import path from 'node:path';
import { describe, it, expect } from 'vitest';
import toRepoPath from './index';

describe('toRepoPath', () => {
  const repoRoot = path.resolve('/repo');

  it.each([
    ['docs/my notes ü.md', 'docs/my notes ü.md'],
    ['docs/guides/deep/a.md', 'docs/guides/deep/a.md'],
    ['..hidden.md', '..hidden.md'],
  ])('returns %s as a slash-separated repository path', (relativePath, expected) => {
    const absPath = path.resolve('/repo', relativePath);

    expect(toRepoPath({ absPath, repoRoot })).toBe(expected);
  });

  it('throws naming both paths for a path outside the repository', () => {
    const absPath = path.resolve('/elsewhere/a.md');

    expect(() => toRepoPath({ absPath, repoRoot })).toThrow(/^readFileHistory:/);
    expect(() => toRepoPath({ absPath, repoRoot })).toThrow(absPath);
    expect(() => toRepoPath({ absPath, repoRoot })).toThrow(repoRoot);
  });

  it('throws for the repository root itself', () => {
    expect(() => toRepoPath({ absPath: repoRoot, repoRoot })).toThrow(/^readFileHistory:/);
  });

  it.runIf(process.platform === 'win32')('ignores drive-letter case and accepts backslashes against a slash root', () => {
    expect(toRepoPath({ absPath: 'd:\\Repo\\docs\\a.md', repoRoot: 'D:/Repo' })).toBe('docs/a.md');
  });

  it.runIf(process.platform === 'win32')('throws for a path on another drive', () => {
    expect(() => toRepoPath({ absPath: 'E:\\other\\a.md', repoRoot: 'D:/Repo' })).toThrow(/^readFileHistory:/);
  });
});
