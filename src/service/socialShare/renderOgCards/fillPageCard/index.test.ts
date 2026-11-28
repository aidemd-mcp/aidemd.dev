import { describe, it, expect, vi } from 'vitest';
import type { Page } from 'playwright';
import type { OgCardInput } from '@/types/socialShare';
import fillPageCard from './index';

function makeCard(overrides: Partial<OgCardInput> = {}): OgCardInput {
  return {
    urlPath: '/learn/spec-driven-vs-intent-driven-development/',
    kind: 'learn',
    title: 'Spec-driven development vs intent-driven development',
    section: 'learn',
    ...overrides,
  };
}

function makePage(read: string): { page: Page; evaluate: ReturnType<typeof vi.fn> } {
  const evaluate = vi.fn(async () => read);
  return { page: { evaluate } as unknown as Page, evaluate };
}

describe('fillPageCard', () => {
  it('passes title, path and section to evaluate', async () => {
    const card = makeCard();
    const { page, evaluate } = makePage(card.title);

    await fillPageCard({ page, card });

    expect(evaluate).toHaveBeenCalledWith(expect.any(Function), {
      title: card.title,
      path: card.urlPath,
      section: 'learn',
    });
  });

  it('passes an absent section through as undefined', async () => {
    const card = makeCard({ kind: 'docsSection', section: undefined });
    const { page, evaluate } = makePage(card.title);

    await fillPageCard({ page, card });

    expect(evaluate).toHaveBeenCalledWith(expect.any(Function), expect.objectContaining({ section: undefined }));
  });

  it('resolves when the read-back equals the title', async () => {
    const card = makeCard();
    const { page } = makePage(card.title);

    await expect(fillPageCard({ page, card })).resolves.toBeUndefined();
  });

  it('throws naming the urlPath when the read-back differs', async () => {
    const card = makeCard();
    const { page } = makePage('Another title');

    await expect(fillPageCard({ page, card })).rejects.toThrow(
      `page card for ${card.urlPath} shows "Another title" instead of its title`,
    );
  });
});
