import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('node:child_process', () => ({
  execFileSync: vi.fn(),
}));

import { execFileSync } from 'node:child_process';
import runGit from './index';

const mockExecFileSync = execFileSync as ReturnType<typeof vi.fn>;

describe('runGit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('passes git, the exact args and the raised buffer, and returns stdout untouched', () => {
    mockExecFileSync.mockReturnValue('  raw output\n');

    const result = runGit(['rev-parse', '--show-toplevel']);

    expect(result).toBe('  raw output\n');
    expect(mockExecFileSync).toHaveBeenCalledWith('git', ['rev-parse', '--show-toplevel'], {
      encoding: 'utf8',
      maxBuffer: 67108864,
    });
  });

  it('rethrows a failure with the readFileHistory prefix, the command and the cause', () => {
    mockExecFileSync.mockImplementation(() => {
      throw new Error('spawnSync git ENOBUFS');
    });

    expect(() => runGit(['log', '-z', '--root'])).toThrow(
      /^readFileHistory: git log -z --root failed: spawnSync git ENOBUFS/,
    );
  });
});
