import { describe, expect, it } from 'vitest';
import siteIdentity from '@/data/siteIdentity';
import verifySecurityTxt from './index';

const now = new Date('2026-11-27T00:00:00.000Z');

function makeText({
  contact = siteIdentity.securityContact as string,
  expires = '2027-05-26T00:00:00.000Z',
} = {}): string {
  return [
    `Contact: ${contact}`,
    `Expires: ${expires}`,
    'Canonical: https://aidemd.dev/.well-known/security.txt',
    'Preferred-Languages: en',
    '',
  ].join('\n');
}

describe('verifySecurityTxt', () => {
  it('passes a clean file', () => {
    expect(() => verifySecurityTxt({ text: makeText(), now })).not.toThrow();
  });

  it('throws on a wrong contact', () => {
    expect(() => verifySecurityTxt({ text: makeText({ contact: 'https://example.com/other' }), now })).toThrow(
      '.well-known/security.txt: Contact is https://example.com/other',
    );
  });

  it('throws on an expiry 30 days out', () => {
    expect(() => verifySecurityTxt({ text: makeText({ expires: '2026-12-27T00:00:00.000Z' }), now })).toThrow(
      '.well-known/security.txt: Expires is 30.0 days out',
    );
  });

  it('throws on an expiry that is not a date', () => {
    expect(() => verifySecurityTxt({ text: makeText({ expires: 'soon' }), now })).toThrow('Expires is not a date');
  });

  it.each([
    ['Contact', 'has no Contact line'],
    ['Expires', 'has no Expires line'],
    ['Canonical', 'has no Canonical line'],
  ])('throws on a missing %s line', (field, message) => {
    const text = makeText()
      .split('\n')
      .filter((line) => !line.startsWith(`${field}:`))
      .join('\n');
    expect(() => verifySecurityTxt({ text, now })).toThrow(`.well-known/security.txt: ${message}`);
  });

  it('throws on an empty file', () => {
    expect(() => verifySecurityTxt({ text: '', now })).toThrow('.well-known/security.txt: is empty');
  });
});
