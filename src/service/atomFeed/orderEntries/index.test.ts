import { describe, it, expect } from 'vitest';
import type { FeedEntry } from '@/types/feed';
import orderEntries from './index';

function makeEntry(overrides: Partial<FeedEntry> = {}): FeedEntry {
  return {
    urlPath: '/docs/hooks/stop/',
    title: 'Stop hook',
    description: 'When the stop hook fires.',
    modified: '2026-11-20T14:03:11-05:00',
    ...overrides,
  };
}

describe('orderEntries', () => {
  it('returns three entries newest first', () => {
    const oldest = makeEntry({ urlPath: '/docs/a/', modified: '2026-11-01T00:00:00+00:00' });
    const middle = makeEntry({ urlPath: '/docs/b/', modified: '2026-11-10T00:00:00+00:00' });
    const newest = makeEntry({ urlPath: '/docs/c/', modified: '2026-11-20T00:00:00+00:00' });

    expect(orderEntries([middle, oldest, newest])).toEqual([newest, middle, oldest]);
  });

  it('compares instants, not strings, across differing offsets', () => {
    // 15:00Z versus 13:00Z: the string-larger date is the older instant
    const later = makeEntry({ urlPath: '/docs/later/', modified: '2026-11-20T10:00:00-05:00' });
    const earlier = makeEntry({ urlPath: '/docs/earlier/', modified: '2026-11-20T14:00:00+01:00' });

    expect(orderEntries([earlier, later])).toEqual([later, earlier]);
  });

  it('orders equal instants by urlPath ascending regardless of input order', () => {
    const first = makeEntry({ urlPath: '/docs/a/', modified: '2026-11-20T10:00:00+00:00' });
    const second = makeEntry({ urlPath: '/docs/b/', modified: '2026-11-20T05:00:00-05:00' });

    const forward = orderEntries([first, second]);
    const reversed = orderEntries([second, first]);

    expect(forward).toEqual([first, second]);
    expect(reversed).toEqual(forward);
  });

  it('does not mutate the input array', () => {
    const a = makeEntry({ urlPath: '/docs/a/', modified: '2026-11-01T00:00:00+00:00' });
    const b = makeEntry({ urlPath: '/docs/b/', modified: '2026-11-20T00:00:00+00:00' });
    const input = [a, b];

    const ordered = orderEntries(input);

    expect(input).toEqual([a, b]);
    expect(ordered).not.toBe(input);
  });

  it('throws naming the urlPath when modified does not parse', () => {
    const bad = makeEntry({ urlPath: '/docs/broken/', modified: 'not-a-date' });

    expect(() => orderEntries([bad])).toThrow('/docs/broken/');
  });
});
