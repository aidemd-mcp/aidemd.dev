import { describe, expect, it } from 'vitest';
import assertPngCard from './index';

/** A PNG header only: signature, IHDR chunk length and type, width, height. */
function makePngHeader({ width = 1200, height = 630 } = {}): Buffer {
  const bytes = Buffer.alloc(24);
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]).copy(bytes, 0);
  bytes.writeUInt32BE(13, 8);
  bytes.write('IHDR', 12, 'ascii');
  bytes.writeUInt32BE(width, 16);
  bytes.writeUInt32BE(height, 20);
  return bytes;
}

describe('assertPngCard', () => {
  it('passes a 1200x630 PNG header', () => {
    expect(() => assertPngCard({ file: 'og.png', bytes: makePngHeader() })).not.toThrow();
  });

  it('throws on a wrong size', () => {
    expect(() => assertPngCard({ file: 'og.png', bytes: makePngHeader({ width: 800 }) })).toThrow(
      'publishSiteFiles: og.png: is 800x630, expected 1200x630',
    );
  });

  it('throws on a bad signature', () => {
    expect(() => assertPngCard({ file: 'og.png', bytes: Buffer.from('not a png at all, really') })).toThrow(
      'og.png: is not a PNG (bad signature)',
    );
  });

  it('throws on a missing IHDR chunk', () => {
    const bytes = makePngHeader();
    bytes.write('IDAT', 12, 'ascii');
    expect(() => assertPngCard({ file: 'og.png', bytes })).toThrow('og.png: is not a PNG (no IHDR chunk)');
  });
});
