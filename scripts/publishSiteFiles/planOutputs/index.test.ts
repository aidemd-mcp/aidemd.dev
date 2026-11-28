import { describe, expect, it } from 'vitest';
import type { OutputSources } from '@/types/siteFiles';
import type { SitePage } from '@/types/sitePage';
import planOutputs from './index';

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

function makeSources(overrides: Partial<OutputSources> = {}): OutputSources {
  return {
    pages: [
      makePage(),
      makePage({ urlPath: '/docs/hooks/stop/', kind: 'doc', markdownUrl: '/docs/hooks/stop.md' }),
      makePage({ urlPath: '/learn/intent/', kind: 'learn', markdownUrl: '/learn/intent.md' }),
    ],
    llms: { llmsTxt: 'llms', llmsFullTxt: 'full' },
    feedXml: '<feed/>',
    securityTxt: 'Contact: x\n',
    markdown: new Map([
      ['/docs/hooks/stop/', 'stop md'],
      ['/learn/intent/', 'intent md'],
    ]),
    images: [
      { address: '/og.png', png: Buffer.from('site') },
      { address: '/og/intent-abc.png', png: Buffer.from('card') },
    ],
    ...overrides,
  };
}

describe('planOutputs', () => {
  it('lists the files in order with paths relative to public/', () => {
    const files = planOutputs(makeSources());
    expect(files.map((file) => file.path)).toEqual([
      'llms.txt',
      'llms-full.txt',
      'feed.xml',
      '.well-known/security.txt',
      'docs/hooks/stop.md',
      'learn/intent.md',
      'og.png',
      'og/intent-abc.png',
    ]);
  });

  it('carries each file its content', () => {
    const files = planOutputs(makeSources());
    const byPath = new Map(files.map((file) => [file.path, file.content]));
    expect(byPath.get('llms.txt')).toBe('llms');
    expect(byPath.get('llms-full.txt')).toBe('full');
    expect(byPath.get('feed.xml')).toBe('<feed/>');
    expect(byPath.get('docs/hooks/stop.md')).toBe('stop md');
    expect(Buffer.isBuffer(byPath.get('og.png'))).toBe(true);
  });

  it('adds no markdown file for a page without a markdownUrl', () => {
    const files = planOutputs(makeSources({ pages: [makePage()], markdown: new Map(), images: [] }));
    expect(files.map((file) => file.path)).toEqual([
      'llms.txt',
      'llms-full.txt',
      'feed.xml',
      '.well-known/security.txt',
    ]);
  });

  it('throws when a page with a markdownUrl has no markdown', () => {
    expect(() => planOutputs(makeSources({ markdown: new Map() }))).toThrow(
      'planOutputs: no markdown for /docs/hooks/stop/',
    );
  });

  it('throws when two files share a path', () => {
    const sources = makeSources({
      images: [
        { address: '/og.png', png: Buffer.from('a') },
        { address: '/og.png', png: Buffer.from('b') },
      ],
    });
    expect(() => planOutputs(sources)).toThrow('planOutputs: two files share the path og.png');
  });
});
