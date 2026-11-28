import { describe, it, expect } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import selectEntries from './index';

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/docs/hooks/stop/',
    title: 'Stop hook',
    description: 'When the stop hook fires.',
    kind: 'doc',
    ogImage: '/og/docs/hooks/stop.png',
    breadcrumb: [],
    ...overrides,
  };
}

describe('selectEntries', () => {
  it('keeps a doc and a learn page that have modified, with every field equal to the page', () => {
    const doc = makePage({ modified: '2026-11-20T14:03:11-05:00', published: '2026-10-01T09:00:00-05:00' });
    const learn = makePage({
      urlPath: '/learn/intent/',
      title: 'Intent',
      description: 'What intent is.',
      kind: 'learn',
      modified: '2026-11-18T08:00:00+00:00',
      published: '2026-11-01T08:00:00+00:00',
    });

    expect(selectEntries([doc, learn])).toEqual([
      {
        urlPath: doc.urlPath,
        title: doc.title,
        description: doc.description,
        modified: '2026-11-20T14:03:11-05:00',
        published: '2026-10-01T09:00:00-05:00',
      },
      {
        urlPath: learn.urlPath,
        title: learn.title,
        description: learn.description,
        modified: '2026-11-18T08:00:00+00:00',
        published: '2026-11-01T08:00:00+00:00',
      },
    ]);
  });

  it('drops a doc without modified', () => {
    expect(selectEntries([makePage({ published: '2026-10-01T09:00:00-05:00' })])).toEqual([]);
  });

  it.each(['home', 'brain', 'brainRecipes', 'observer', 'privacy'] as const)(
    'drops a %s page even when it carries modified',
    (kind) => {
      expect(selectEntries([makePage({ kind, modified: '2026-11-20T14:03:11-05:00' })])).toEqual([]);
    },
  );

  it('keeps a docsSection page with modified', () => {
    const section = makePage({ urlPath: '/docs/hooks/', kind: 'docsSection', modified: '2026-11-20T14:03:11-05:00' });

    expect(selectEntries([section]).map((entry) => entry.urlPath)).toEqual(['/docs/hooks/']);
  });

  it('yields an object with no published key when the page has none', () => {
    const [entry] = selectEntries([makePage({ modified: '2026-11-20T14:03:11-05:00' })]);

    expect(Object.keys(entry).sort()).toEqual(['description', 'modified', 'title', 'urlPath']);
  });

  it('returns [] for an empty list', () => {
    expect(selectEntries([])).toEqual([]);
  });

  it('preserves input order and does not mutate the input array', () => {
    const pages = [
      makePage({ urlPath: '/docs/b/', modified: '2026-11-01T00:00:00+00:00' }),
      makePage({ urlPath: '/docs/a/', modified: '2026-11-02T00:00:00+00:00' }),
    ];
    const snapshot = structuredClone(pages);

    expect(selectEntries(pages).map((entry) => entry.urlPath)).toEqual(['/docs/b/', '/docs/a/']);
    expect(pages).toEqual(snapshot);
  });
});
