import { describe, it, expect, beforeAll } from 'vitest';
import type { Metadata } from 'next';
import siteIdentity from '@/data/siteIdentity';
import type { SitePage } from '@/types/sitePage';
import listSitePages from '@/app/_shared/listSitePages';
import observerCopy from '@/app/observer/_data/observerCopy';
import buildPageMetadata from './index';

type OpenGraphFields = {
  type: string;
  url: string;
  siteName: string;
  title: string;
  images: { url: string; width: number; height: number; alt: string }[];
  publishedTime?: string;
  modifiedTime?: string;
};

function makePage(overrides: Partial<SitePage> = {}): SitePage {
  return {
    urlPath: '/docs/hooks/stop/',
    title: 'Stop hook',
    description: 'What the Stop hook does.',
    kind: 'doc',
    ogImage: '/og/stop-0123456789.png',
    breadcrumb: [],
    ...overrides,
  };
}

function openGraphOf(metadata: Metadata): OpenGraphFields {
  return metadata.openGraph as unknown as OpenGraphFields;
}

describe('buildPageMetadata', () => {
  it('builds the canonical from the identity origin and the page path', () => {
    const metadata = buildPageMetadata(makePage());
    expect(metadata.alternates?.canonical).toBe('https://aidemd.dev/docs/hooks/stop/');
    expect(openGraphOf(metadata).url).toBe('https://aidemd.dev/docs/hooks/stop/');
  });

  it('sets the absolute document title and the plain page title on the share fields', () => {
    const metadata = buildPageMetadata(makePage());
    expect(metadata.title).toEqual({ absolute: 'Stop hook | aidemd.dev' });
    expect(openGraphOf(metadata).title).toBe('Stop hook');
    expect(openGraphOf(metadata).siteName).toBe('aidemd.dev');
    expect(metadata.twitter).toEqual({
      card: 'summary_large_image',
      title: 'Stop hook',
      description: 'What the Stop hook does.',
      images: ['/og/stop-0123456789.png'],
    });
  });

  it('adds the markdown alternate only when the page has a markdown copy', () => {
    const without = buildPageMetadata(makePage());
    const withCopy = buildPageMetadata(makePage({ markdownUrl: '/docs/hooks/stop.md' }));
    expect(without.alternates?.types).toEqual({ 'application/atom+xml': '/feed.xml' });
    expect(withCopy.alternates?.types).toEqual({
      'application/atom+xml': '/feed.xml',
      'text/markdown': '/docs/hooks/stop.md',
    });
  });

  it('adds article dates only for article kinds and only when present', () => {
    const dated = openGraphOf(
      buildPageMetadata(makePage({ published: '2026-01-02T03:04:05+00:00', modified: '2026-02-03T04:05:06+00:00' })),
    );
    expect(dated.type).toBe('article');
    expect(dated.publishedTime).toBe('2026-01-02T03:04:05+00:00');
    expect(dated.modifiedTime).toBe('2026-02-03T04:05:06+00:00');

    const undated = openGraphOf(buildPageMetadata(makePage()));
    expect(undated).not.toHaveProperty('publishedTime');
    expect(undated).not.toHaveProperty('modifiedTime');

    const website = openGraphOf(
      buildPageMetadata(makePage({ kind: 'privacy', urlPath: '/privacy/', modified: '2026-02-03T04:05:06+00:00' })),
    );
    expect(website.type).toBe('website');
    expect(website).not.toHaveProperty('modifiedTime');
  });

  it('uses 1200x630 and the card alt when no image override is given', () => {
    const image = openGraphOf(buildPageMetadata(makePage())).images[0];
    expect(image.width).toBe(1200);
    expect(image.height).toBe(630);
    expect(image.alt).toContain('Stop hook');
  });

  it('uses the image override for a page whose image is not a generated card', () => {
    const page = makePage({ kind: 'observer', urlPath: '/observer/', ogImage: '/observer-share.png' });
    const image = openGraphOf(buildPageMetadata(page, { width: 1280, height: 720, alt: 'The observer UI' })).images[0];
    expect(image).toEqual({ url: '/observer-share.png', width: 1280, height: 720, alt: 'The observer UI' });
  });

  it('throws when neither the override nor the card gives an alt', () => {
    const page = makePage({ kind: 'observer', urlPath: '/observer/', ogImage: '/observer-share.png' });
    expect(() => buildPageMetadata(page)).toThrow('buildPageMetadata: no image alt for /observer/');
  });
});

describe('buildPageMetadata over every real page', () => {
  let pages: SitePage[];

  beforeAll(async () => {
    pages = await listSitePages();
  });

  it('lists pages to check', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it('makes og:url the canonical URL and og:image the page own image for every page', () => {
    for (const page of pages) {
      const isObserver = page.urlPath === '/observer/';
      const metadata = isObserver ? buildPageMetadata(page, observerCopy.capture) : buildPageMetadata(page);
      const expected = siteIdentity.url + page.urlPath;
      expect(openGraphOf(metadata).url, page.urlPath).toBe(expected);
      expect(metadata.alternates?.canonical, page.urlPath).toBe(expected);
      const image = openGraphOf(metadata).images[0];
      expect(image.url, page.urlPath).toBe(page.ogImage);
      if (isObserver) {
        expect(image.width).toBe(1440);
        expect(image.height).toBe(1180);
      }
    }
  });
});
