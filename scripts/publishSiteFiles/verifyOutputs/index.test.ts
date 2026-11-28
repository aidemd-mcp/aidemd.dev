import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { SiteFile } from '@/types/siteFiles';
import type { SitePage } from '@/types/sitePage';

const calls: string[] = [];

vi.mock('./verifyLlmsFiles', () => ({ default: vi.fn(() => void calls.push('llms')) }));
vi.mock('./verifyFeed', () => ({ default: vi.fn(() => void calls.push('feed')) }));
vi.mock('./verifySecurityTxt', () => ({ default: vi.fn(() => void calls.push('security')) }));
vi.mock('./verifyMarkdownCopies', () => ({ default: vi.fn(async () => void calls.push('markdown')) }));
vi.mock('./verifyShareImages', () => ({ default: vi.fn(async () => void calls.push('images')) }));

import verifyFeed from './verifyFeed';
import verifyOutputs from './index';

const now = new Date('2026-11-27T00:00:00.000Z');

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

const pages = [makePage(), makePage({ urlPath: '/docs/hooks/stop/', kind: 'doc', markdownUrl: '/docs/hooks/stop.md' })];
const files: SiteFile[] = [
  { path: 'llms.txt', content: '# AIDE\n' },
  { path: 'llms-full.txt', content: '# AIDE\n' },
  { path: 'feed.xml', content: '<feed>\n<entry>\n<entry>\n' },
  { path: '.well-known/security.txt', content: 'Contact: x\n' },
  { path: 'docs/hooks/stop.md', content: '# Stop\n' },
  { path: 'og.png', content: Buffer.from('png') },
  { path: 'og/stop-abc.png', content: Buffer.from('png') },
];

let publicDir: string;

async function writeAll(): Promise<void> {
  for (const file of files) {
    await mkdir(path.dirname(path.join(publicDir, file.path)), { recursive: true });
    await writeFile(path.join(publicDir, file.path), file.content);
  }
}

beforeEach(async () => {
  calls.length = 0;
  publicDir = await mkdtemp(path.join(os.tmpdir(), 'verify-outputs-'));
  await writeAll();
});

afterEach(async () => {
  await rm(publicDir, { recursive: true, force: true });
});

describe('verifyOutputs', () => {
  it('runs the family checks in order and returns the report', async () => {
    const report = await verifyOutputs({ publicDir, pages, files, now });
    expect(calls).toEqual(['llms', 'feed', 'security', 'markdown', 'images']);
    expect(report).toEqual({ files: 7, markdownCopies: 1, shareImages: 2, feedEntries: 2 });
  });

  it('checks the content read back from disk, not the planned string', async () => {
    await writeFile(path.join(publicDir, 'llms.txt'), '# changed\n');
    await expect(verifyOutputs({ publicDir, pages, files, now })).rejects.toThrow(
      'publishSiteFiles: llms.txt: differs from the planned content',
    );
    expect(calls).toEqual([]);
  });

  it('throws naming a planned file that was not written', async () => {
    await rm(path.join(publicDir, 'feed.xml'));
    await expect(verifyOutputs({ publicDir, pages, files, now })).rejects.toThrow('publishSiteFiles: feed.xml: is missing');
  });

  it('throws naming a file that was written empty', async () => {
    await writeFile(path.join(publicDir, 'og.png'), '');
    await expect(verifyOutputs({ publicDir, pages, files, now })).rejects.toThrow('publishSiteFiles: og.png: is empty');
  });

  it('lets a helper error propagate unchanged and stops the later checks', async () => {
    const failure = new Error('publishSiteFiles: feed.xml: broken');
    vi.mocked(verifyFeed).mockImplementationOnce(() => {
      throw failure;
    });
    await expect(verifyOutputs({ publicDir, pages, files, now })).rejects.toBe(failure);
    expect(calls).toEqual(['llms']);
  });
});
