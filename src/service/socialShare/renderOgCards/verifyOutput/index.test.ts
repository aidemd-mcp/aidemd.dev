import { describe, it, expect } from 'vitest';
import verifyOutput from './index';

// ---------------------------------------------------------------------------
// PNG fixture factories
//
// PNG structure (binary layout):
//   Bytes  0–7   : 8-byte signature  (89 50 4E 47 0D 0A 1A 0A)
//   Bytes  8–11  : IHDR chunk length (0x0000000D = 13)
//   Bytes 12–15  : chunk type        (ASCII "IHDR")
//   Bytes 16–19  : width             (big-endian uint32)
//   Bytes 20–23  : height            (big-endian uint32)
//   Bytes 24–32  : rest of IHDR data + CRC (zeros — verifyOutput does not read them)
//
// Total: 33 bytes — the minimal buffer verifyOutput needs to parse dimensions.
// The byte-size check uses png.length, so oversize cases pad the buffer.
//
// makePngWithSrgb appends a minimal sRGB chunk after the IHDR:
//   Bytes 33–36  : chunk data length (0x00000001 — 1 byte of data)
//   Bytes 37–40  : chunk type        (ASCII "sRGB")
//   Byte  41     : rendering intent  (0x00 = Perceptual)
//   Bytes 42–45  : CRC32 (zero placeholder — verifyOutput only checks type)
// ---------------------------------------------------------------------------

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const IHDR_LENGTH = [0x00, 0x00, 0x00, 0x0d];
const IHDR_TYPE = [0x49, 0x48, 0x44, 0x52]; // ASCII "IHDR"

/** Writes a big-endian uint32 into a 4-byte array. */
function uint32BE(value: number): number[] {
  return [(value >>> 24) & 0xff, (value >>> 16) & 0xff, (value >>> 8) & 0xff, value & 0xff];
}

/** Builds the IHDR-only prefix (33 bytes) for the given dimensions — an untagged PNG. */
function makePng(width: number, height: number): Buffer {
  return Buffer.from([
    ...PNG_SIGNATURE,
    ...IHDR_LENGTH,
    ...IHDR_TYPE,
    ...uint32BE(width),
    ...uint32BE(height),
    // 5 remaining IHDR data bytes + 4-byte CRC — all zeros
    0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00,
  ]);
}

/** Builds a minimal PNG with an sRGB chunk appended immediately after IHDR. */
function makePngWithSrgb(width: number, height: number): Buffer {
  const srgbChunk = Buffer.from([
    0x00, 0x00, 0x00, 0x01, // chunk data length: 1
    0x73, 0x52, 0x47, 0x42, // chunk type: "sRGB"
    0x00, // rendering intent: Perceptual
    0x00, 0x00, 0x00, 0x00, // CRC (placeholder — not validated by verifyOutput)
  ]);
  return Buffer.concat([makePng(width, height), srgbChunk]);
}

const LABEL = '/learn/some-page/';

describe('verifyOutput', () => {
  it('(a) valid 1200×630 PNG with sRGB chunk under 300 KB — returns correct metrics, does not throw', () => {
    const png = makePngWithSrgb(1200, 630);

    const result = verifyOutput({ png, label: LABEL });

    expect(result).toEqual({ bytes: png.length, width: 1200, height: 630 });
  });

  it('(a2) valid 1200×630 PNG with NO sRGB/iCCP chunk — throws descriptive error', () => {
    const png = makePng(1200, 630);

    expect(() => verifyOutput({ png, label: LABEL })).toThrow(/missing an sRGB color-space chunk/);
  });

  it('(b) 1200×630 PNG over 300 KB — throws with message containing "300 KB" and the byte count', () => {
    const png = Buffer.concat([makePngWithSrgb(1200, 630), Buffer.alloc(400 * 1024)]);

    expect(() => verifyOutput({ png, label: LABEL })).toThrow(/300 KB/);
    expect(() => verifyOutput({ png, label: LABEL })).toThrow(String(png.length));
  });

  it('(c) 2400×1200 PNG — throws with message containing the wrong dims', () => {
    const png = makePng(2400, 1200);

    expect(() => verifyOutput({ png, label: LABEL })).toThrow(/2400/);
    expect(() => verifyOutput({ png, label: LABEL })).toThrow(/1200/);
  });

  it('(d) missing PNG signature — throws "not a valid PNG"', () => {
    const png = Buffer.alloc(33, 0x00);

    expect(() => verifyOutput({ png, label: LABEL })).toThrow(/not a valid PNG/);
  });

  it.each([
    ['signature', Buffer.alloc(33, 0x00)],
    ['dimensions', makePng(2400, 1200)],
    ['size', Buffer.concat([makePngWithSrgb(1200, 630), Buffer.alloc(400 * 1024)])],
    ['color space', makePng(1200, 630)],
  ])('(e) the %s error starts with the label', (_check, png) => {
    expect(() => verifyOutput({ png, label: LABEL })).toThrow(new RegExp(`^${LABEL}: `));
  });
});
