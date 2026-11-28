import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import writeOutputs from './index';

let publicDir: string;

beforeEach(async () => {
  publicDir = await mkdtemp(path.join(os.tmpdir(), 'write-outputs-'));
});

afterEach(async () => {
  await rm(publicDir, { recursive: true, force: true });
});

describe('writeOutputs', () => {
  it('creates parent folders and writes strings as UTF-8 with LF kept', async () => {
    await writeOutputs({
      publicDir,
      files: [{ path: 'docs/hooks/stop.md', content: '# Stop → go\nline two\n' }],
    });
    const written = await readFile(path.join(publicDir, 'docs/hooks/stop.md'));
    expect(written.toString('utf8')).toBe('# Stop → go\nline two\n');
    expect(written.includes(0x0d)).toBe(false);
  });

  it('writes buffers as bytes', async () => {
    const bytes = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x00, 0xff]);
    await writeOutputs({ publicDir, files: [{ path: 'og/card-abc.png', content: bytes }] });
    expect(await readFile(path.join(publicDir, 'og/card-abc.png'))).toEqual(bytes);
  });

  it('writes a file at the root and in a hidden folder', async () => {
    await writeOutputs({
      publicDir,
      files: [
        { path: 'llms.txt', content: 'a' },
        { path: '.well-known/security.txt', content: 'b' },
      ],
    });
    expect(await readFile(path.join(publicDir, 'llms.txt'), 'utf8')).toBe('a');
    expect(await readFile(path.join(publicDir, '.well-known/security.txt'), 'utf8')).toBe('b');
  });
});
