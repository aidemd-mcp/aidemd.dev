import { describe, it, expect, vi } from 'vitest';
import type { Page } from 'playwright';
import type { TitleMeasure } from '@/types/socialShare';
import fitTitle from './index';

const FITS: TitleMeasure = { lines: 2, overflowsWidth: false, bottom: 400 };

function makePage(measures: TitleMeasure[]): { page: Page; evaluate: ReturnType<typeof vi.fn> } {
  const evaluate = vi.fn();
  for (const measure of measures) evaluate.mockResolvedValueOnce(measure);
  return { page: { evaluate } as unknown as Page, evaluate };
}

describe('fitTitle', () => {
  it('returns 64 when the largest size fits', async () => {
    const { page } = makePage([FITS]);

    await expect(fitTitle({ page, urlPath: '/docs/a/' })).resolves.toBe(64);
  });

  it('steps down until the title is within three lines', async () => {
    const { page } = makePage([
      { ...FITS, lines: 4 },
      { ...FITS, lines: 4 },
      { ...FITS, lines: 3 },
    ]);

    await expect(fitTitle({ page, urlPath: '/learn/long/' })).resolves.toBe(56);
  });

  it('stops measuring after the first fit', async () => {
    const { page, evaluate } = makePage([{ ...FITS, lines: 4 }, FITS]);

    await fitTitle({ page, urlPath: '/docs/a/' });

    expect(evaluate).toHaveBeenCalledTimes(2);
  });

  it('sends each candidate size and the line height to the browser', async () => {
    const { page, evaluate } = makePage([{ ...FITS, lines: 4 }, FITS]);

    await fitTitle({ page, urlPath: '/docs/a/' });

    expect(evaluate.mock.calls.map((call) => call[1])).toEqual([
      { fontSize: 64, lineHeight: 1.08 },
      { fontSize: 60, lineHeight: 1.08 },
    ]);
  });

  it('throws naming the urlPath when the title overflows the column at every size', async () => {
    const evaluate = vi.fn().mockResolvedValue({ ...FITS, overflowsWidth: true });

    await expect(fitTitle({ page: { evaluate } as unknown as Page, urlPath: '/docs/wide/' })).rejects.toThrow(
      'title for /docs/wide/ does not fit: more than 3 lines or wider than the column at the 44px floor',
    );
    expect(evaluate).toHaveBeenCalledTimes(6);
  });

  it('throws when the title ends below y = 510 at every size', async () => {
    const evaluate = vi.fn().mockResolvedValue({ ...FITS, bottom: 511 });

    await expect(fitTitle({ page: { evaluate } as unknown as Page, urlPath: '/docs/low/' })).rejects.toThrow(
      'title for /docs/low/ does not fit',
    );
  });

  it('accepts a title ending exactly at y = 510', async () => {
    const { page } = makePage([{ ...FITS, bottom: 510 }]);

    await expect(fitTitle({ page, urlPath: '/docs/a/' })).resolves.toBe(64);
  });
});
