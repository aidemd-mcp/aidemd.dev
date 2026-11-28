import { describe, it, expect, vi } from 'vitest';
import type { Page } from 'playwright';
import loadDesignFonts from './index';

function makePage(loadedByWeight: Record<number, number>): { page: Page; evaluate: ReturnType<typeof vi.fn> } {
  const evaluate = vi.fn(async (_fn: unknown, weight: number) => loadedByWeight[weight]);
  return { page: { evaluate } as unknown as Page, evaluate };
}

describe('loadDesignFonts', () => {
  it('resolves when all four weights load', async () => {
    const { page, evaluate } = makePage({ 400: 1, 500: 1, 600: 1, 700: 1 });

    await expect(loadDesignFonts(page)).resolves.toBeUndefined();
    expect(evaluate.mock.calls.map((call) => call[1])).toEqual([400, 500, 600, 700]);
  });

  it('throws naming the weight that did not load', async () => {
    const { page } = makePage({ 400: 1, 500: 1, 600: 0, 700: 1 });

    await expect(loadDesignFonts(page)).rejects.toThrow('design font JetBrains Mono 600 did not load');
  });
});
