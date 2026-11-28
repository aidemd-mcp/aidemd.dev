import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { SiteFile } from '@/types/siteFiles';
import type { SitePage } from '@/types/sitePage';
import verifyMarkdownCopies from './index';

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/docs/hooks/stop/',
    title: 'Stop',
    description: 'Stop hook',
    kind: 'doc',
    markdownUrl: '/docs/hooks/stop.md',
    ogImage: '/og/stop-abc.png',
    breadcrumb: [],
    ...overrides,
  };
}

const pages = [makePage(), makePage({ urlPath: '/learn/intent/', kind: 'learn', markdownUrl: '/learn/intent.md' })];
const files: SiteFile[] = [
  { path: 'docs/hooks/stop.md', content: '# Stop\n' },
  { path: 'learn/intent.md', content: '# Intent\n' },
];

let publicDir: string;

async function put(file: string, content: string): Promise<void> {
  await mkdir(path.dirname(path.join(publicDir, file)), { recursive: true });
  await writeFile(path.join(publicDir, file), content);
}

beforeEach(async () => {
  publicDir = await mkdtemp(path.join(os.tmpdir(), 'verify-markdown-'));
  await put('docs/hooks/stop.md', '# Stop\n');
  await put('learn/intent.md', '# Intent\n');
});

afterEach(async () => {
  await rm(publicDir, { recursive: true, force: true });
});

describe('verifyMarkdownCopies', () => {
  it('passes when every copy is present and identical', async () => {
    await expect(verifyMarkdownCopies({ publicDir, pages, files })).resolves.toBeUndefined();
  });

  it('throws on a missing copy', async () => {
    await rm(path.join(publicDir, 'learn/intent.md'));
    await expect(verifyMarkdownCopies({ publicDir, pages, files })).rejects.toThrow(
      'publishSiteFiles: learn/intent.md: is missing',
    );
  });

  it('throws on an orphan copy', async () => {
    await put('docs/old/gone.md', '# Gone\n');
    await expect(verifyMarkdownCopies({ publicDir, pages, files })).rejects.toThrow(
      'publishSiteFiles: docs/old/gone.md: is a markdown copy of no page',
    );
  });

  it('throws on a truncated copy', async () => {
    await put('docs/hooks/stop.md', '# St');
    await expect(verifyMarkdownCopies({ publicDir, pages, files })).rejects.toThrow(
      'publishSiteFiles: docs/hooks/stop.md: differs from the planned content',
    );
  });

  it('throws on an empty copy', async () => {
    await put('docs/hooks/stop.md', '');
    await expect(verifyMarkdownCopies({ publicDir, pages, files })).rejects.toThrow(
      'publishSiteFiles: docs/hooks/stop.md: is empty',
    );
  });

  it('passes when docs/ and learn/ do not exist and no page has a copy', async () => {
    await rm(path.join(publicDir, 'docs'), { recursive: true });
    await rm(path.join(publicDir, 'learn'), { recursive: true });
    await expect(verifyMarkdownCopies({ publicDir, pages: [], files: [] })).resolves.toBeUndefined();
  });
});
