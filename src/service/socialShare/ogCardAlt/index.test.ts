import { describe, it, expect } from 'vitest';
import type { SitePageKind } from '@/types/sitePage';
import type { OgCardInput } from '@/types/socialShare';
import ogImageConfig from '../ogImageConfig';
import ogCardAlt from './index';

function makeCard(overrides: Partial<OgCardInput> = {}): OgCardInput {
  return {
    urlPath: '/docs/methodology/aide-spec/',
    kind: 'doc',
    title: 'AIDE spec',
    section: 'methodology',
    ...overrides,
  };
}

describe('ogCardAlt', () => {
  it('returns null for observer', () => {
    expect(ogCardAlt(makeCard({ kind: 'observer', urlPath: '/observer/', section: undefined }))).toBeNull();
  });

  it('keeps the canonical site alt word for word on a site-card page', () => {
    expect(ogCardAlt(makeCard({ kind: 'home', urlPath: '/', section: undefined }))).toBe(ogImageConfig().alt);
  });

  it('names the title and section on a page card with a section', () => {
    expect(ogCardAlt(makeCard())).toBe(
      'AIDEMD.DEV share card for "AIDE spec" (methodology), with Expo, the AIDEMD mascot.',
    );
  });

  it('names only the title on a page card without a section', () => {
    expect(ogCardAlt(makeCard({ kind: 'docsSection', title: 'Agents', section: undefined }))).toBe(
      'AIDEMD.DEV share card for "Agents", with Expo, the AIDEMD mascot.',
    );
  });

  it('inserts a long title as given, untrimmed', () => {
    const title = 'Spec-driven development vs intent-driven development, and what changes for agents';
    expect(ogCardAlt(makeCard({ kind: 'learn', title, section: 'learn' }))).toContain(`"${title}"`);
  });

  it.each<SitePageKind>([
    'home',
    'brain',
    'brainRecipes',
    'privacy',
    'docsIndex',
    'docsSection',
    'doc',
    'learnIndex',
    'learn',
  ])('%s alt names Expo and no abandoned name', (kind) => {
    const alt = ogCardAlt(makeCard({ kind }));
    expect(alt).not.toBeNull();
    expect(alt).toContain('Expo');
    expect(alt).not.toMatch(/Aidey/);
    expect(alt).not.toMatch(/AIDEY/);
    expect(alt).not.toMatch(/\bAID\b/);
    expect(alt).not.toMatch(/tetsukod/i);
  });
});
