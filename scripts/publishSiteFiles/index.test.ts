import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { SitePage } from '@/types/sitePage';

vi.mock('@/app/_shared/listSitePages', () => ({ default: vi.fn() }));
vi.mock('@/service/llmsTxt', () => ({ default: vi.fn() }));
vi.mock('@/service/atomFeed', () => ({ default: vi.fn() }));
vi.mock('@/service/socialShare/renderOgCards', () => ({ default: vi.fn() }));
vi.mock('./buildLlmsPages', () => ({ default: vi.fn() }));
vi.mock('./clearGeneratedOutput', () => ({ default: vi.fn() }));
vi.mock('./collectMarkdown', () => ({ default: vi.fn() }));
vi.mock('./planOutputs', () => ({ default: vi.fn() }));
vi.mock('./renderSecurityTxt', () => ({ default: vi.fn() }));
vi.mock('./verifyOutputs', () => ({ default: vi.fn() }));
vi.mock('./writeOutputs', () => ({ default: vi.fn() }));

import listSitePages from '@/app/_shared/listSitePages';
import composeLlmsFiles from '@/service/llmsTxt';
import composeFeed from '@/service/atomFeed';
import renderOgCards from '@/service/socialShare/renderOgCards';
import buildLlmsPages from './buildLlmsPages';
import clearGeneratedOutput from './clearGeneratedOutput';
import collectMarkdown from './collectMarkdown';
import feedMeta from './feedMeta';
import planOutputs from './planOutputs';
import renderSecurityTxt from './renderSecurityTxt';
import verifyOutputs from './verifyOutputs';
import writeOutputs from './writeOutputs';
import publishSiteFiles from './index';

const mockList = listSitePages as ReturnType<typeof vi.fn>;
const mockCompose = composeLlmsFiles as ReturnType<typeof vi.fn>;
const mockFeed = composeFeed as ReturnType<typeof vi.fn>;
const mockRender = renderOgCards as ReturnType<typeof vi.fn>;
const mockBuildPages = buildLlmsPages as ReturnType<typeof vi.fn>;
const mockClear = clearGeneratedOutput as ReturnType<typeof vi.fn>;
const mockCollect = collectMarkdown as ReturnType<typeof vi.fn>;
const mockPlan = planOutputs as ReturnType<typeof vi.fn>;
const mockSecurity = renderSecurityTxt as ReturnType<typeof vi.fn>;
const mockVerify = verifyOutputs as ReturnType<typeof vi.fn>;
const mockWrite = writeOutputs as ReturnType<typeof vi.fn>;

const pages = [{ urlPath: '/' }] as SitePage[];
const markdown = new Map([['/docs/a/', '# A\n']]);
const llmsPages = [{ urlPath: '/' }];
const llms = { llmsTxt: '# a\n', llmsFullTxt: '# b\n' };
const images = [{ address: '/og.png', png: Buffer.from([1]) }];
const files = [{ path: 'llms.txt', content: '# a\n' }];
const report = { files: 1, markdownCopies: 0, shareImages: 1, feedEntries: 1 };
const now = new Date('2026-11-27T00:00:00.000Z');
const publicDir = '/site/public';

/** Records the name of each mock as it is called, so the test can assert order. */
function trackCalls(): string[] {
  const calls: string[] = [];
  const track = (name: string, mock: ReturnType<typeof vi.fn>) => {
    const original = mock.getMockImplementation();
    mock.mockImplementation((...args: unknown[]) => {
      calls.push(name);
      return original?.(...args);
    });
  };
  track('list', mockList);
  track('markdown', mockCollect);
  track('llms', mockCompose);
  track('feed', mockFeed);
  track('security', mockSecurity);
  track('render', mockRender);
  track('plan', mockPlan);
  track('clear', mockClear);
  track('write', mockWrite);
  track('verify', mockVerify);
  return calls;
}

beforeEach(() => {
  vi.resetAllMocks();
  mockList.mockResolvedValue(pages);
  mockCollect.mockResolvedValue(markdown);
  mockBuildPages.mockReturnValue(llmsPages);
  mockCompose.mockReturnValue(llms);
  mockFeed.mockReturnValue('<feed/>');
  mockSecurity.mockReturnValue('Contact: x\n');
  mockRender.mockResolvedValue(images);
  mockPlan.mockReturnValue(files);
  mockClear.mockResolvedValue(undefined);
  mockWrite.mockResolvedValue(undefined);
  mockVerify.mockResolvedValue(report);
});

describe('publishSiteFiles', () => {
  it('runs list, markdown, composers, render, plan, clear, write and verify in that order', async () => {
    const calls = trackCalls();

    const result = await publishSiteFiles({ publicDir, now });

    expect(calls).toEqual([
      'list',
      'markdown',
      'llms',
      'feed',
      'security',
      'render',
      'plan',
      'clear',
      'write',
      'verify',
    ]);
    expect(result).toBe(report);
  });

  it('hands each step the output of the step before it', async () => {
    await publishSiteFiles({ publicDir, now });

    expect(mockCollect).toHaveBeenCalledWith(pages);
    expect(mockBuildPages).toHaveBeenCalledWith({ pages, markdown });
    expect(mockCompose).toHaveBeenCalledWith({ pages: llmsPages });
    expect(mockFeed).toHaveBeenCalledWith({ pages, meta: feedMeta });
    expect(mockSecurity).toHaveBeenCalledWith(now);
    expect(mockRender).toHaveBeenCalledWith(pages);
    expect(mockPlan).toHaveBeenCalledWith({
      pages,
      llms,
      feedXml: '<feed/>',
      securityTxt: 'Contact: x\n',
      markdown,
      images,
    });
    expect(mockClear).toHaveBeenCalledWith(publicDir);
    expect(mockWrite).toHaveBeenCalledWith({ publicDir, files });
    expect(mockVerify).toHaveBeenCalledWith({ publicDir, pages, files, now });
  });

  it.each([
    ['listSitePages', () => mockList.mockRejectedValue(new Error('shallow history'))],
    ['collectMarkdown', () => mockCollect.mockRejectedValue(new Error('blank markdown'))],
    ['composeLlmsFiles', () => mockCompose.mockImplementation(() => { throw new Error('llms'); })],
    ['composeFeed', () => mockFeed.mockImplementation(() => { throw new Error('feed'); })],
    ['renderSecurityTxt', () => mockSecurity.mockImplementation(() => { throw new Error('security'); })],
    ['renderOgCards', () => mockRender.mockRejectedValue(new Error('card'))],
    ['planOutputs', () => mockPlan.mockImplementation(() => { throw new Error('plan'); })],
  ])('leaves the existing output untouched when %s throws', async (_name, fail) => {
    fail();

    await expect(publishSiteFiles({ publicDir, now })).rejects.toThrow();

    expect(mockClear).not.toHaveBeenCalled();
    expect(mockWrite).not.toHaveBeenCalled();
  });

  it('propagates a verifyOutputs failure unchanged', async () => {
    const failure = new Error('publishSiteFiles: feed.xml: bad');
    mockVerify.mockRejectedValue(failure);

    await expect(publishSiteFiles({ publicDir, now })).rejects.toBe(failure);
  });
});
