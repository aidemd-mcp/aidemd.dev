import { describe, expect, it } from 'vitest';
import siteReferences from './index';

describe('siteReferences', () => {
  it('references the organization by its stable @id', () => {
    expect(siteReferences.organization['@id']).toBe('https://aidemd.dev/#organization');
  });

  it('references the website by its stable @id', () => {
    expect(siteReferences.website['@id']).toBe('https://aidemd.dev/#website');
  });

  it('carries exactly the one @id key on each reference', () => {
    expect(Object.keys(siteReferences.organization)).toEqual(['@id']);
    expect(Object.keys(siteReferences.website)).toEqual(['@id']);
  });
});
