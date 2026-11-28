import { describe, it, expect, vi } from 'vitest';
import type { Page } from 'playwright';

vi.mock('../tagSrgb/index', () => ({
  default: vi.fn((png: Buffer) => Buffer.concat([png, Buffer.from('-tagged')])),
}));

import captureOgElement from './index';

/** Builds a mock page whose locator(...).screenshot(...) resolves to `shot`. */
function makeMockPage(shot: Buffer) {
  const screenshot = vi.fn().mockResolvedValue(shot);
  const locator = vi.fn().mockReturnValue({ screenshot });
  return { page: { locator } as unknown as Page, locator, screenshot };
}

describe('captureOgElement', () => {
  it('locates the card by the given selector', async () => {
    const { page, locator } = makeMockPage(Buffer.from('raw'));

    await captureOgElement({ page, selector: '#og-page' });

    expect(locator).toHaveBeenCalledWith('#og-page');
  });

  it('screenshots as png with animations disabled and no path', async () => {
    const { page, screenshot } = makeMockPage(Buffer.from('raw'));

    await captureOgElement({ page, selector: '#og' });

    const options = screenshot.mock.calls[0][0];
    expect(options).toMatchObject({ type: 'png', omitBackground: false, animations: 'disabled' });
    expect(options).not.toHaveProperty('path');
  });

  it('returns the sRGB-tagged buffer', async () => {
    const { page } = makeMockPage(Buffer.from('raw'));

    const png = await captureOgElement({ page, selector: '#og' });

    expect(png.toString()).toBe('raw-tagged');
  });
});
