import path from 'node:path';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import warnUnresolvedLink from './index';

describe('warnUnresolvedLink', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  it('warns once naming the href, the linking file and that it was left as written', () => {
    warnUnresolvedLink({
      href: './Gone Doc.md',
      fromPath: path.resolve('/repo-a', 'docs', 'index.md'),
      resolvedPath: path.resolve('/repo-a', 'docs', 'Gone Doc.md'),
    });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const message = String(warnSpy.mock.calls[0][0]);
    expect(message).toContain('./Gone Doc.md');
    expect(message).toContain('index.md');
    expect(message).toContain('left as written');
  });

  it('does not warn again for the same (fromPath, resolvedPath) with a differently encoded href', () => {
    const fromPath = path.resolve('/repo-b', 'docs', 'index.md');
    const resolvedPath = path.resolve('/repo-b', 'docs', 'Gone Doc.md');

    warnUnresolvedLink({ href: './Gone Doc.md', fromPath, resolvedPath });
    warnUnresolvedLink({ href: './Gone%20Doc.md', fromPath, resolvedPath });

    expect(warnSpy).toHaveBeenCalledTimes(1);
  });

  it('warns again for a different linking file', () => {
    const resolvedPath = path.resolve('/repo-c', 'docs', 'Gone.md');

    warnUnresolvedLink({
      href: './Gone.md',
      fromPath: path.resolve('/repo-c', 'docs', 'one.md'),
      resolvedPath,
    });
    warnUnresolvedLink({
      href: './Gone.md',
      fromPath: path.resolve('/repo-c', 'docs', 'two.md'),
      resolvedPath,
    });

    expect(warnSpy).toHaveBeenCalledTimes(2);
  });
});
