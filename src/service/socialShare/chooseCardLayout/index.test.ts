import { describe, it, expect } from 'vitest';
import type { SitePageKind } from '@/types/sitePage';
import type { OgCardLayout } from '@/types/socialShare';
import chooseCardLayout from './index';

describe('chooseCardLayout', () => {
  it.each<[SitePageKind, OgCardLayout | null]>([
    ['home', 'site'],
    ['brain', 'site'],
    ['brainRecipes', 'site'],
    ['privacy', 'site'],
    ['docsIndex', 'site'],
    ['docsSection', 'page'],
    ['doc', 'page'],
    ['learnIndex', 'page'],
    ['learn', 'page'],
    ['observer', null],
  ])('%s -> %s', (kind, layout) => {
    expect(chooseCardLayout(kind)).toBe(layout);
  });
});
