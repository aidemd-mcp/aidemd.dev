import { describe, expect, it } from 'vitest';
import buildSiteGraph from './index';

describe('buildSiteGraph', () => {
  it('builds the Lowmeadow LLC Organization node exactly', () => {
    const [organization] = buildSiteGraph();
    expect(organization).toEqual({
      '@type': 'Organization',
      '@id': 'https://aidemd.dev/#organization',
      name: 'Lowmeadow LLC',
      url: 'https://aidemd.dev/',
      logo: 'https://aidemd.dev/icon-512.png',
    });
  });

  it('builds the aidemd.dev WebSite node exactly', () => {
    const [, website] = buildSiteGraph();
    expect(website).toEqual({
      '@type': 'WebSite',
      '@id': 'https://aidemd.dev/#website',
      name: 'aidemd.dev',
      url: 'https://aidemd.dev/',
      publisher: { '@id': 'https://aidemd.dev/#organization' },
    });
  });

  it('points the WebSite publisher at the Organization @id', () => {
    const [organization, website] = buildSiteGraph();
    expect(website.publisher['@id']).toBe(organization['@id']);
  });

  it('names no person, profile link or sibling brand', () => {
    const serialized = JSON.stringify(buildSiteGraph());
    for (const forbidden of ['sameAs', 'Person', 'github.com', 'npmjs.com', 'TetsuKodai']) {
      expect(serialized).not.toContain(forbidden);
    }
  });
});
