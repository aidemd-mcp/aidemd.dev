import { describe, it, expect, vi } from 'vitest';
import type { DocRoute } from '@/types/docs';

vi.mock('@/service/docsRegistry', () => ({
  default: vi.fn(),
  getDocMeta: vi.fn(),
}));

import buildRegistry, { getDocMeta } from '@/service/docsRegistry';
import listDocsPages from './index';

function makeRoute(overrides: Partial<DocRoute>): DocRoute {
  return {
    section: 'methodology',
    slug: 'aide-spec',
    title: 'AIDE spec',
    urlPath: '/docs/methodology/aide-spec',
    absPath: '/repo/.aide/docs/aide-spec.md',
    order: 0,
    commit: 'abc1234',
    ...overrides,
  };
}

describe('listDocsPages', () => {
  it('lists the docs index, then each section index followed by its docs', async () => {
    const methodologyDoc = makeRoute({});
    const toolsDoc = makeRoute({
      section: 'tools',
      slug: 'aide_read',
      title: 'aide_read',
      urlPath: '/docs/tools/aide_read',
      order: 1,
    });
    vi.mocked(buildRegistry).mockResolvedValue({ routes: [methodologyDoc, toolsDoc], getByKey: () => undefined });
    vi.mocked(getDocMeta).mockImplementation(async (route) => ({
      title: route.slug,
      description: `About ${route.slug}.`,
    }));

    const pages = await listDocsPages();

    expect(pages.map((page) => page.urlPath)).toEqual([
      '/docs/',
      '/docs/methodology/',
      '/docs/methodology/aide-spec/',
      '/docs/commands/',
      '/docs/agents/',
      '/docs/skills/',
      '/docs/tools/',
      '/docs/tools/aide_read/',
      '/docs/hooks/',
    ]);
    expect(pages.map((page) => page.kind)).toEqual([
      'docsIndex',
      'docsSection',
      'doc',
      'docsSection',
      'docsSection',
      'docsSection',
      'docsSection',
      'doc',
      'docsSection',
    ]);
  });

  it('builds each doc from its own route and metadata', async () => {
    const route = makeRoute({});
    vi.mocked(buildRegistry).mockResolvedValue({ routes: [route], getByKey: () => undefined });
    vi.mocked(getDocMeta).mockResolvedValue({ title: 'Spec', description: 'Described.' });

    const pages = await listDocsPages();
    const doc = pages.find((page) => page.kind === 'doc');

    expect(doc?.description).toBe('Described.');
    expect(doc?.breadcrumb.at(-1)?.name).toBe('Spec');
  });
});
