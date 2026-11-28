import { describe, it, expect } from 'vitest';
import type { LinkClick } from '@/types/linkClick';
import resolveClientHref from './index';

function makeClick(overrides: Partial<LinkClick> = {}): LinkClick {
  return {
    defaultPrevented: false,
    button: 0,
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    target: null,
    download: false,
    href: '/docs/reference/hooks/SessionStart/',
    origin: 'https://aidemd.dev',
    ...overrides,
  };
}

describe('resolveClientHref', () => {
  it('returns the path for a plain primary click on a site-relative link', () => {
    expect(resolveClientHref(makeClick())).toBe('/docs/reference/hooks/SessionStart/');
  });

  it('returns the path with search and hash for a same-origin absolute href', () => {
    const click = makeClick({ href: 'https://aidemd.dev/docs/x/?a=1#y' });
    expect(resolveClientHref(click)).toBe('/docs/x/?a=1#y');
  });

  it.each(['_self', ''])('still returns the path for target %j', (target) => {
    expect(resolveClientHref(makeClick({ target }))).toBe('/docs/reference/hooks/SessionStart/');
  });

  it.each<[string, Partial<LinkClick>]>([
    ['defaultPrevented', { defaultPrevented: true }],
    ['middle button', { button: 1 }],
    ['right button', { button: 2 }],
    ['metaKey', { metaKey: true }],
    ['ctrlKey', { ctrlKey: true }],
    ['shiftKey', { shiftKey: true }],
    ['altKey', { altKey: true }],
    ['target _blank', { target: '_blank' }],
    ['target _parent', { target: '_parent' }],
    ['download', { download: true }],
    ['null href', { href: null }],
    ['empty href', { href: '' }],
    ['hash-only href', { href: '#section' }],
    ['other origin', { href: 'https://example.com/' }],
    ['protocol-relative other origin', { href: '//example.com/docs/' }],
    ['mailto', { href: 'mailto:a@b.c' }],
    ['tel', { href: 'tel:123' }],
    ['javascript scheme', { href: 'javascript:void(0)' }],
  ])('returns undefined for %s', (_label, overrides) => {
    expect(resolveClientHref(makeClick(overrides))).toBeUndefined();
  });
});
