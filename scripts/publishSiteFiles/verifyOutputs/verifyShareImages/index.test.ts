import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import verifyShareImages from './index';

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/',
    title: 'Home',
    description: 'Home page',
    kind: 'home',
    ogImage: '/og.png',
    breadcrumb: [],
    ...overrides,
  };
}

/** A PNG header only: signature, IHDR chunk length and type, width, height. */
function makePngHeader({ width = 1200, height = 630 } = {}): Buffer {
  const bytes = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write('IHDR', 12, 'ascii');
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
}

const pages = [
  makePage(),
  makePage({ urlPath: '/learn/intent/', kind: 'learn', ogImage: '/og/intent-abc.png' }),
  makePage({ urlPath: '/observer/', kind: 'observer', ogImage: '/observer/capture.png' }),
];

let publicDir: string;

async function put(file: string, bytes: Buffer): Promise<void> {
  await mkdir(path.dirname(path.join(publicDir, file)), { recursive: true });
  await writeFile(path.join(publicDir, file), bytes);
}

beforeEach(async () => {
  publicDir = await mkdtemp(path.join(os.tmpdir(), 'verify-images-'));
  await put('og.png', makePngHeader());
  await put('og/intent-abc.png', makePngHeader());
  await put('observer/capture.png', Buffer.from('committed capture'));
});

afterEach(async () => {
  await rm(publicDir, { recursive: true, force: true });
});

describe('verifyShareImages', () => {
  it('passes when every card is present and sized', async () => {
    await expect(verifyShareImages({ publicDir, pages })).resolves.toBeUndefined();
  });

  it('throws when og.png is missing', async () => {
    await rm(path.join(publicDir, 'og.png'));
    await expect(verifyShareImages({ publicDir, pages })).rejects.toThrow('publishSiteFiles: og.png: is missing');
  });

  it('throws when a page card is missing', async () => {
    await rm(path.join(publicDir, 'og/intent-abc.png'));
    await expect(verifyShareImages({ publicDir, pages })).rejects.toThrow(
      'publishSiteFiles: og/intent-abc.png: is missing',
    );
  });

  it('throws when a card is not a PNG', async () => {
    await put('og/intent-abc.png', Buffer.from('this is definitely not a png file'));
    await expect(verifyShareImages({ publicDir, pages })).rejects.toThrow('og/intent-abc.png: is not a PNG');
  });

  it('throws when a card has the wrong size', async () => {
    await put('og/intent-abc.png', makePngHeader({ height: 600 }));
    await expect(verifyShareImages({ publicDir, pages })).rejects.toThrow('og/intent-abc.png: is 1200x600');
  });

  it('throws on an orphan card', async () => {
    await put('og/gone-123.png', makePngHeader());
    await expect(verifyShareImages({ publicDir, pages })).rejects.toThrow(
      'publishSiteFiles: og/gone-123.png: is a share card of no page',
    );
  });

  it('throws when the committed observer capture is missing', async () => {
    await rm(path.join(publicDir, 'observer/capture.png'));
    await expect(verifyShareImages({ publicDir, pages })).rejects.toThrow(
      'publishSiteFiles: observer/capture.png: is missing',
    );
  });
});
