import { describe, it, expect } from 'vitest';
import parseGitLog from './index';

/** One commit as git prints it: record separator, hash, unit separator, date, then the change fields each ended by NUL. */
function makeRecord(hash: string, date: string, fields: string[] = []): string {
  const header = `\x1e${hash}\x1f${date}\0`;
  if (fields.length === 0) return header;
  return `${header}\n${fields.map((field) => `${field}\0`).join('')}`;
}

describe('parseGitLog', () => {
  it('parses commits newest first with their changes', () => {
    const stdout =
      makeRecord('bbb2222', '2026-02-02T10:00:00+01:00', ['M', 'docs/a.md']) +
      makeRecord('aaa1111', '2026-01-01T09:00:00+01:00', ['A', 'docs/a.md']);

    expect(parseGitLog(stdout)).toEqual([
      {
        hash: 'bbb2222',
        date: '2026-02-02T10:00:00+01:00',
        changes: [{ status: 'M', path: 'docs/a.md' }],
      },
      {
        hash: 'aaa1111',
        date: '2026-01-01T09:00:00+01:00',
        changes: [{ status: 'A', path: 'docs/a.md' }],
      },
    ]);
  });

  it('reads a rename as fromPath then path', () => {
    const stdout = makeRecord('ccc3333', '2026-03-03T10:00:00+01:00', ['R100', 'docs/old.md', 'docs/new.md']);

    expect(parseGitLog(stdout)[0].changes).toEqual([
      { status: 'R', fromPath: 'docs/old.md', path: 'docs/new.md' },
    ]);
  });

  it('reads a copy as fromPath then path', () => {
    const stdout = makeRecord('ddd4444', '2026-03-04T10:00:00+01:00', ['C075', 'a.md', 'b.md']);

    expect(parseGitLog(stdout)[0].changes).toEqual([{ status: 'C', fromPath: 'a.md', path: 'b.md' }]);
  });

  it('reads several changes of one commit in order', () => {
    const stdout = makeRecord('eee5555', '2026-03-05T10:00:00+01:00', ['M', 'x.md', 'R090', 'y.md', 'z.md', 'D', 'w.md']);

    expect(parseGitLog(stdout)[0].changes).toEqual([
      { status: 'M', path: 'x.md' },
      { status: 'R', fromPath: 'y.md', path: 'z.md' },
      { status: 'D', path: 'w.md' },
    ]);
  });

  it('gives a commit with no changes an empty list and still parses its neighbours', () => {
    const stdout =
      makeRecord('ccc3333', '2026-03-03T10:00:00+01:00', ['M', 'a.md']) +
      makeRecord('bbb2222', '2026-02-02T10:00:00+01:00') +
      makeRecord('aaa1111', '2026-01-01T09:00:00+01:00', ['A', 'a.md']);

    const commits = parseGitLog(stdout);

    expect(commits.map((commit) => commit.hash)).toEqual(['ccc3333', 'bbb2222', 'aaa1111']);
    expect(commits[1].changes).toEqual([]);
    expect(commits[0].changes).toHaveLength(1);
    expect(commits[2].changes).toHaveLength(1);
  });

  it('returns a path with a space and a non-English character unchanged', () => {
    const stdout = makeRecord('aaa1111', '2026-01-01T09:00:00+01:00', ['A', 'docs/my notes ü.md']);

    expect(parseGitLog(stdout)[0].changes[0].path).toBe('docs/my notes ü.md');
  });

  it('throws for an unknown status letter', () => {
    const stdout = makeRecord('aaa1111', '2026-01-01T09:00:00+01:00', ['Q', 'a.md']);

    expect(() => parseGitLog(stdout)).toThrow(/^parseGitLog:/);
  });

  it('throws for a rename with only one path left', () => {
    const stdout = makeRecord('aaa1111', '2026-01-01T09:00:00+01:00', ['R100', 'old.md']);

    expect(() => parseGitLog(stdout)).toThrow(/^parseGitLog:/);
  });

  it('throws for a header without exactly a hash and a date', () => {
    expect(() => parseGitLog('\x1eaaa1111\0')).toThrow(/^parseGitLog:/);
    expect(() => parseGitLog('\x1eaaa1111\x1f2026-01-01\x1fextra\0')).toThrow(/^parseGitLog:/);
  });

  it('returns no commits for empty output', () => {
    expect(parseGitLog('')).toEqual([]);
  });
});
