import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SitePage } from '@/types/sitePage';
import type { OgCardJob } from '@/types/socialShare';

vi.mock('./selectOgCards', () => ({ default: vi.fn() }));
vi.mock('./launchBrowser', () => ({ default: vi.fn() }));
vi.mock('./loadDesignSource', () => ({ default: vi.fn() }));
vi.mock('./loadDesignFonts', () => ({ default: vi.fn() }));
vi.mock('./fillPageCard', () => ({ default: vi.fn() }));
vi.mock('./fitTitle', () => ({ default: vi.fn() }));
vi.mock('./captureOgElement', () => ({ default: vi.fn() }));
vi.mock('./verifyOutput', () => ({ default: vi.fn() }));

import selectOgCards from './selectOgCards';
import launchBrowser from './launchBrowser';
import loadDesignSource from './loadDesignSource';
import loadDesignFonts from './loadDesignFonts';
import fillPageCard from './fillPageCard';
import fitTitle from './fitTitle';
import captureOgElement from './captureOgElement';
import verifyOutput from './verifyOutput';
import renderOgCards from './index';

const mockSelectOgCards = selectOgCards as ReturnType<typeof vi.fn>;
const mockLaunchBrowser = launchBrowser as ReturnType<typeof vi.fn>;
const mockLoadDesignSource = loadDesignSource as ReturnType<typeof vi.fn>;
const mockLoadDesignFonts = loadDesignFonts as ReturnType<typeof vi.fn>;
const mockFillPageCard = fillPageCard as ReturnType<typeof vi.fn>;
const mockFitTitle = fitTitle as ReturnType<typeof vi.fn>;
const mockCaptureOgElement = captureOgElement as ReturnType<typeof vi.fn>;
const mockVerifyOutput = verifyOutput as ReturnType<typeof vi.fn>;

const SITE_JOB: OgCardJob = { layout: 'site', address: '/og.png', label: 'site card' };

/** Builds a page-layout job for a docs page at the given urlPath. */
function makePageJob(urlPath: string): OgCardJob {
  return {
    layout: 'page',
    address: `/og/${urlPath.replace(/^\/|\/$/g, '').replace(/\//g, '-')}-abcdef0123.png`,
    label: urlPath,
    page: { urlPath, kind: 'doc', title: `Title of ${urlPath}`, section: 'methodology' },
  };
}

const PAGES = [] as SitePage[];

describe('renderOgCards', () => {
  const close = vi.fn();
  const browserPage = { name: 'browser-page' };
  let events: string[];

  beforeEach(() => {
    vi.clearAllMocks();
    events = [];
    close.mockResolvedValue(undefined);
    mockLaunchBrowser.mockResolvedValue({ browser: { close }, page: browserPage });
    mockLoadDesignSource.mockResolvedValue(undefined);
    mockLoadDesignFonts.mockImplementation(async () => {
      events.push('fonts');
    });
    mockFillPageCard.mockImplementation(async ({ card }: { card: { urlPath: string } }) => {
      events.push(`fill:${card.urlPath}`);
    });
    mockFitTitle.mockImplementation(async ({ urlPath }: { urlPath: string }) => {
      events.push(`fit:${urlPath}`);
      return 64;
    });
    mockCaptureOgElement.mockImplementation(async ({ selector }: { selector: string }) => {
      events.push(`capture:${selector}`);
      return Buffer.from(`png:${selector}:${events.length}`);
    });
  });

  it('renders only the site card via #og and returns one image at /og.png', async () => {
    mockSelectOgCards.mockReturnValue([SITE_JOB]);

    const images = await renderOgCards([]);

    expect(mockSelectOgCards).toHaveBeenCalledWith([]);
    expect(mockCaptureOgElement).toHaveBeenCalledTimes(1);
    expect(mockCaptureOgElement).toHaveBeenCalledWith({ page: browserPage, selector: '#og' });
    expect(mockFillPageCard).not.toHaveBeenCalled();
    expect(mockFitTitle).not.toHaveBeenCalled();
    expect(images).toHaveLength(1);
    expect(images[0].address).toBe('/og.png');
    expect(Buffer.isBuffer(images[0].png)).toBe(true);
  });

  it('fills, fits and captures each page card in job order and returns images in the same order', async () => {
    const jobA = makePageJob('/docs/methodology/aide-spec/');
    const jobB = makePageJob('/learn/');
    mockSelectOgCards.mockReturnValue([SITE_JOB, jobA, jobB]);

    const images = await renderOgCards(PAGES);

    expect(events).toEqual([
      'fonts',
      'capture:#og',
      'fill:/docs/methodology/aide-spec/',
      'fit:/docs/methodology/aide-spec/',
      'capture:#og-page',
      'fill:/learn/',
      'fit:/learn/',
      'capture:#og-page',
    ]);
    expect(mockFillPageCard).toHaveBeenNthCalledWith(1, { page: browserPage, card: jobA.layout === 'page' ? jobA.page : null });
    expect(mockFitTitle).toHaveBeenNthCalledWith(2, { page: browserPage, urlPath: '/learn/' });
    expect(images.map((image) => image.address)).toEqual([SITE_JOB.address, jobA.address, jobB.address]);
  });

  it('passes each job label to verifyOutput with the captured png', async () => {
    const jobA = makePageJob('/learn/');
    mockSelectOgCards.mockReturnValue([SITE_JOB, jobA]);

    const images = await renderOgCards(PAGES);

    expect(mockVerifyOutput).toHaveBeenCalledTimes(2);
    expect(mockVerifyOutput).toHaveBeenNthCalledWith(1, { png: images[0].png, label: 'site card' });
    expect(mockVerifyOutput).toHaveBeenNthCalledWith(2, { png: images[1].png, label: '/learn/' });
  });

  it('never launches the browser when selectOgCards throws', async () => {
    mockSelectOgCards.mockImplementation(() => {
      throw new Error('share-image address mismatch for /learn/');
    });

    await expect(renderOgCards(PAGES)).rejects.toThrow('share-image address mismatch for /learn/');

    expect(mockLaunchBrowser).not.toHaveBeenCalled();
  });

  it('propagates a fitTitle error and still closes the browser once', async () => {
    mockSelectOgCards.mockReturnValue([SITE_JOB, makePageJob('/learn/')]);
    mockFitTitle.mockRejectedValue(new Error('title for /learn/ does not fit'));

    await expect(renderOgCards(PAGES)).rejects.toThrow('title for /learn/ does not fit');

    expect(close).toHaveBeenCalledTimes(1);
  });

  it('loads the design fonts before the first capture', async () => {
    mockSelectOgCards.mockReturnValue([SITE_JOB, makePageJob('/learn/')]);

    await renderOgCards(PAGES);

    expect(mockLoadDesignSource).toHaveBeenCalledWith(browserPage);
    expect(mockLoadDesignFonts).toHaveBeenCalledWith(browserPage);
    const fontsOrder = mockLoadDesignFonts.mock.invocationCallOrder[0];
    const firstCaptureOrder = mockCaptureOgElement.mock.invocationCallOrder[0];
    expect(fontsOrder).toBeLessThan(firstCaptureOrder);
    expect(events[0]).toBe('fonts');
  });
});
