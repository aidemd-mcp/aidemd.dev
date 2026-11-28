import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('@/lib/utils/readFileHistory', () => ({
  default: vi.fn(),
}));

import readFileHistory from '@/lib/utils/readFileHistory';

const readFileHistoryMock = vi.mocked(readFileHistory);

/** Loads a fresh resolveCommitHash so its module-level memo starts empty. */
async function loadResolveCommitHash() {
  vi.resetModules();
  const { default: resolveCommitHash } = await import('./index');
  const { default: freshReader } = await import('@/lib/utils/readFileHistory');
  return { resolveCommitHash, reader: vi.mocked(freshReader) };
}

beforeEach(() => {
  readFileHistoryMock.mockReset();
});

describe('resolveCommitHash', () => {
  it('returns the last commit the history reader reports', async () => {
    const { resolveCommitHash, reader } = await loadResolveCommitHash();
    reader.mockReturnValue({
      lastCommit: 'b75834c',
      lastChanged: '2026-11-27T09:00:00+00:00',
    });

    expect(resolveCommitHash('/repo/a.md')).toBe('b75834c');
  });

  it('returns "uncommitted" when the file has no history', async () => {
    const { resolveCommitHash, reader } = await loadResolveCommitHash();
    reader.mockReturnValue({});

    expect(resolveCommitHash('/repo/new.md')).toBe('uncommitted');
  });

  it('returns "uncommitted" when the history reader throws', async () => {
    const { resolveCommitHash, reader } = await loadResolveCommitHash();
    reader.mockImplementation(() => {
      throw new Error('readFileHistory: git log failed');
    });

    expect(resolveCommitHash('/repo/a.md')).toBe('uncommitted');
  });

  it('asks the reader once per path and repeats the same answer', async () => {
    const { resolveCommitHash, reader } = await loadResolveCommitHash();
    reader.mockReturnValue({ lastCommit: 'b75834c' });

    const first = resolveCommitHash('/repo/a.md');
    const second = resolveCommitHash('/repo/a.md');

    expect(second).toBe(first);
    expect(reader).toHaveBeenCalledTimes(1);
  });
});
