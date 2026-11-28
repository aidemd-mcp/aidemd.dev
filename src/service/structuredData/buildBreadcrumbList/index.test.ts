import { describe, expect, it } from 'vitest';
import buildBreadcrumbList from './index';

const trail = [
  { name: 'Home', urlPath: '/' },
  { name: 'Docs', urlPath: '/docs/' },
  { name: 'Stop hook', urlPath: '/docs/hooks/stop/' },
];

describe('buildBreadcrumbList', () => {
  it('numbers positions 1..n in order', () => {
    const positions = buildBreadcrumbList(trail).itemListElement.map((entry) => entry.position);
    expect(positions).toEqual([1, 2, 3]);
  });

  it('keeps the names identical and in input order', () => {
    const names = buildBreadcrumbList(trail).itemListElement.map((entry) => entry.name);
    expect(names).toEqual(['Home', 'Docs', 'Stop hook']);
  });

  it('makes every item an absolute URL with its trailing slash', () => {
    const items = buildBreadcrumbList(trail).itemListElement.map((entry) => entry.item);
    expect(items).toEqual([
      'https://aidemd.dev/',
      'https://aidemd.dev/docs/',
      'https://aidemd.dev/docs/hooks/stop/',
    ]);
  });

  it('types the list and each entry', () => {
    const node = buildBreadcrumbList(trail);
    expect(node['@type']).toBe('BreadcrumbList');
    expect(node.itemListElement.every((entry) => entry['@type'] === 'ListItem')).toBe(true);
  });

  it('throws on a one-item breadcrumb', () => {
    expect(() => buildBreadcrumbList([trail[0]])).toThrow(
      'structuredData: a breadcrumb needs at least 2 items',
    );
  });
});
