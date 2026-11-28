import { describe, it, expect } from 'vitest';
import type { DocRoute, DocSection } from '@/types/docs';
import buildDocPage from './index';

function makeRoute(overrides: Partial<DocRoute> = {}): DocRoute {
  return {
    section: 'hooks',
    slug: 'Stop',
    title: 'Stop hook',
    urlPath: '/docs/hooks/stop',
    absPath: '/repo/.aide/reference/hooks/Stop.md',
    order: 1,
    commit: 'abc1234',
    published: '2026-01-02T03:04:05+00:00',
    modified: '2026-02-03T04:05:06+00:00',
    ...overrides,
  };
}

function makeMeta(overrides: Partial<{ title: string; description: string | undefined }> = {}) {
  return { title: 'Stop', description: 'What the Stop hook does.', ...overrides };
}

describe('buildDocPage', () => {
  it('builds the canonical record from the route and its metadata', () => {
    const page = buildDocPage({ route: makeRoute(), meta: makeMeta() });
    expect(page.urlPath).toBe('/docs/hooks/stop/');
    expect(page.kind).toBe('doc');
    expect(page.title).toBe('Stop hook');
    expect(page.description).toBe('What the Stop hook does.');
    expect(page.section).toBe('hooks');
    expect(page.markdownUrl).toBe('/docs/hooks/stop.md');
    expect(page.published).toBe('2026-01-02T03:04:05+00:00');
    expect(page.modified).toBe('2026-02-03T04:05:06+00:00');
    expect(page.ogImage).toMatch(/^\/og\/docs-hooks-stop-[0-9a-f]{10}\.png$/);
  });

  it('trails AIDE, DOCS, the upper-cased section and the metadata title', () => {
    const page = buildDocPage({ route: makeRoute(), meta: makeMeta({ title: 'Stop' }) });
    expect(page.breadcrumb).toEqual([
      { name: 'AIDE', urlPath: '/' },
      { name: 'DOCS', urlPath: '/docs/' },
      { name: 'HOOKS', urlPath: '/docs/hooks/' },
      { name: 'Stop', urlPath: '/docs/hooks/stop/' },
    ]);
  });

  it('keeps the file title and the breadcrumb tail apart when frontmatter has no title', () => {
    const page = buildDocPage({ route: makeRoute({ title: 'The Stop hook H1' }), meta: makeMeta({ title: 'Stop' }) });
    expect(page.title).toBe('The Stop hook H1');
    expect(page.breadcrumb.at(-1)?.name).toBe('Stop');
  });

  it('falls back to an AIDE-paired description when none resolves', () => {
    const page = buildDocPage({ route: makeRoute(), meta: makeMeta({ description: undefined }) });
    expect(page.description).toBe('Stop hook — canonical documentation for intent-driven AIDE');
  });

  it('collapses a multi-line description to one line', () => {
    const page = buildDocPage({ route: makeRoute(), meta: makeMeta({ description: 'First line.\n  Second\tline.\n' }) });
    expect(page.description).toBe('First line. Second line.');
  });

  it('leaves the date keys out when version history proved neither', () => {
    const page = buildDocPage({ route: makeRoute({ published: undefined, modified: undefined }), meta: makeMeta() });
    expect(page).not.toHaveProperty('published');
    expect(page).not.toHaveProperty('modified');
  });

  it('copies only the date that exists', () => {
    const page = buildDocPage({ route: makeRoute({ modified: undefined }), meta: makeMeta() });
    expect(page.published).toBe('2026-01-02T03:04:05+00:00');
    expect(page).not.toHaveProperty('modified');
  });

  it.each<[DocSection, string]>([
    ['methodology', 'methodology'],
    ['commands', 'commands'],
    ['agents', 'agents'],
    ['skills', 'skills'],
    ['tools', 'tools'],
    ['hooks', 'hooks'],
  ])('labels a %s doc with the section %s', (section, label) => {
    const page = buildDocPage({
      route: makeRoute({ section, urlPath: `/docs/${section}/x` }),
      meta: makeMeta(),
    });
    expect(page.section).toBe(label);
    expect(page.breadcrumb[2]).toEqual({ name: section.toUpperCase(), urlPath: `/docs/${section}/` });
  });
});
