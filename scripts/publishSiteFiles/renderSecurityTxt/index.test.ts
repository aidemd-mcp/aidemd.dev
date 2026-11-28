import { describe, expect, it } from 'vitest';
import renderSecurityTxt from './index';

describe('renderSecurityTxt', () => {
  it('renders exactly four LF-terminated lines with the expiry 180 days out', () => {
    const now = new Date('2026-11-27T00:00:00.000Z');
    expect(renderSecurityTxt(now)).toBe(
      [
        'Contact: https://github.com/aidemd-mcp/server/security/advisories/new',
        'Expires: 2027-05-26T00:00:00.000Z',
        'Canonical: https://aidemd.dev/.well-known/security.txt',
        'Preferred-Languages: en',
        '',
      ].join('\n'),
    );
  });

  it('contains no carriage return', () => {
    expect(renderSecurityTxt(new Date('2026-11-27T00:00:00.000Z'))).not.toContain('\r');
  });
});
