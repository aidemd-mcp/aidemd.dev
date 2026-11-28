import { mkdir, mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import clearGeneratedOutput from './index';

let publicDir: string;

async function seed(relativePath: string): Promise<void> {
  const target = path.join(publicDir, relativePath);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, 'x');
}

beforeEach(async () => {
  publicDir = await mkdtemp(path.join(os.tmpdir(), 'clear-generated-'));
});

afterEach(async () => {
  await rm(publicDir, { recursive: true, force: true });
});

describe('clearGeneratedOutput', () => {
  it('removes every generated entry and keeps everything else', async () => {
    const generated = [
      'og/a-123.png',
      'docs/hooks/stop.md',
      'learn/intent.md',
      '.well-known/security.txt',
      'llms.txt',
      'llms-full.txt',
      'feed.xml',
      'og.png',
    ];
    const kept = ['observer/capture.png', 'CNAME', 'robots.txt', 'expo/icon.png', 'sticker.png', 'icon-192.png'];
    await Promise.all([...generated, ...kept].map(seed));

    await clearGeneratedOutput(publicDir);

    expect((await readdir(publicDir)).sort()).toEqual([
      'CNAME',
      'expo',
      'icon-192.png',
      'observer',
      'robots.txt',
      'sticker.png',
    ]);
    expect(await readdir(path.join(publicDir, 'observer'))).toEqual(['capture.png']);
  });

  it('succeeds on an empty public folder', async () => {
    await expect(clearGeneratedOutput(publicDir)).resolves.toBeUndefined();
  });
});
