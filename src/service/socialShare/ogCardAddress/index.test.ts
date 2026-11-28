import { describe, it, expect, vi } from 'vitest';
import type { SitePageKind } from '@/types/sitePage';
import type { OgCardInput } from '@/types/socialShare';

const mockHashDesignSource = vi.hoisted(() => vi.fn(() => 'design-hash-one'));

vi.mock('./hashDesignSource', () => ({ default: mockHashDesignSource }));

import ogCardAddress from './index';

function makeCard(overrides: Partial<OgCardInput> = {}): OgCardInput {
  return {
    urlPath: '/docs/methodology/aide-spec/',
    kind: 'doc',
    title: 'AIDE spec',
    section: 'methodology',
    ...overrides,
  };
}

describe('ogCardAddress', () => {
  it.each<SitePageKind>(['home', 'brain', 'brainRecipes', 'privacy', 'docsIndex'])(
    '%s uses the shared site card',
    (kind) => {
      expect(ogCardAddress(makeCard({ kind, section: undefined }))).toBe('/og.png');
    },
  );

  it('returns null for observer', () => {
    expect(ogCardAddress(makeCard({ kind: 'observer', urlPath: '/observer/', section: undefined }))).toBeNull();
  });

  it('gives a doc page a slugged, hashed address', () => {
    expect(ogCardAddress(makeCard())).toMatch(/^\/og\/docs-methodology-aide-spec-[0-9a-f]{10}\.png$/);
  });

  it('slugs the learn index without a trailing dash', () => {
    const address = ogCardAddress(makeCard({ kind: 'learnIndex', urlPath: '/learn/', title: 'Learn', section: 'learn' }));
    expect(address).toMatch(/^\/og\/learn-[0-9a-f]{10}\.png$/);
  });

  it('gives equal input an equal address', () => {
    expect(ogCardAddress(makeCard())).toBe(ogCardAddress(makeCard()));
  });

  it('changes the address when the title changes', () => {
    expect(ogCardAddress(makeCard({ title: 'AIDE plan' }))).not.toBe(ogCardAddress(makeCard()));
  });

  it('changes the address when the section changes', () => {
    expect(ogCardAddress(makeCard({ section: 'tools' }))).not.toBe(ogCardAddress(makeCard()));
  });

  it('changes the address when the design source changes', () => {
    const before = ogCardAddress(makeCard());
    mockHashDesignSource.mockReturnValueOnce('design-hash-two');
    expect(ogCardAddress(makeCard())).not.toBe(before);
  });
});
