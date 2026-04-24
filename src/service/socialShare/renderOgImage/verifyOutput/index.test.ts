import { describe, it, expect, vi, beforeEach } from 'vitest';

// ---------------------------------------------------------------------------
// Module-level mocks — hoisted before any imports by Vitest.
// We mock node:fs/promises so no real filesystem access occurs.
// ---------------------------------------------------------------------------

vi.mock('node:fs/promises', () => ({
  readFile: vi.fn(),
  stat: vi.fn(),
}));

import { readFile, stat } from 'node:fs/promises';
import verifyOutput from './index';

const readFileMock = vi.mocked(readFile);
const statMock = vi.mocked(stat);

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
// The "file size" check uses fs.stat, not buffer.length, so the Buffer
// stays tiny regardless of the simulated on-disk byte count.
//
// makePngHeaderWithSrgb appends a minimal sRGB chunk after the IHDR:
//   Bytes 33–36  : chunk data length (0x00000001 — 1 byte of data)
//   Bytes 37–40  : chunk type        (ASCII "sRGB")
//   Byte  41     : rendering intent  (0x00 = Perceptual)
//   Bytes 42–45  : CRC32 (non-zero placeholder — verifyOutput only checks type)
// ---------------------------------------------------------------------------

const PNG_SIGNATURE = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
const IHDR_LENGTH   = [0x00, 0x00, 0x00, 0x0d];
const IHDR_TYPE     = [0x49, 0x48, 0x44, 0x52]; // ASCII "IHDR"

/** Writes a big-endian uint32 into a 4-byte array. */
function uint32BE(value: number): number[] {
  return [
    (value >>> 24) & 0xff,
    (value >>> 16) & 0xff,
    (value >>>  8) & 0xff,
     value         & 0xff,
  ];
}

/**
 * Builds the IHDR-only prefix (33 bytes) for the given dimensions.
 * No color-space chunk is included — represents an untagged PNG.
 * Remaining IHDR bytes (bit depth, colour type, compression, filter,
 * interlace, CRC) are zeroed — verifyOutput never reads them.
 */
function makePngHeader(width: number, height: number): Buffer {
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

/**
 * Builds a minimal PNG with an sRGB chunk appended immediately after IHDR.
 * The sRGB CRC bytes are zeroed — verifyOutput's chunk walker checks only
 * the chunk type field, not the CRC.
 */
function makePngHeaderWithSrgb(width: number, height: number): Buffer {
  const ihdr = makePngHeader(width, height);
  const srgbChunk = Buffer.from([
    0x00, 0x00, 0x00, 0x01,               // chunk data length: 1
    0x73, 0x52, 0x47, 0x42,               // chunk type: "sRGB"
    0x00,                                  // rendering intent: Perceptual
    0x00, 0x00, 0x00, 0x00,               // CRC (placeholder — not validated by verifyOutput)
  ]);
  return Buffer.concat([ihdr, srgbChunk]);
}

const FAKE_PATH = '/tmp/og.png';

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

beforeEach(() => {
  vi.clearAllMocks();
});

describe('verifyOutput', () => {
  it('(a) valid 1200×630 PNG with sRGB chunk under 300 KB — returns correct metrics, does not throw', async () => {
    const buf = makePngHeaderWithSrgb(1200, 630);
    readFileMock.mockResolvedValue(buf as unknown as Parameters<typeof readFileMock>[0] extends infer P ? Awaited<ReturnType<typeof readFile>> : never);
    statMock.mockResolvedValue({ size: 100 * 1024 } as Awaited<ReturnType<typeof stat>>);

    const result = await verifyOutput(FAKE_PATH);

    expect(result.width).toBe(1200);
    expect(result.height).toBe(630);
    expect(result.bytes).toBe(100 * 1024);
  });

  it('(a2) valid 1200×630 PNG with NO sRGB/iCCP chunk — throws descriptive error', async () => {
    const buf = makePngHeader(1200, 630);
    readFileMock.mockResolvedValue(buf as unknown as Awaited<ReturnType<typeof readFile>>);
    statMock.mockResolvedValue({ size: 100 * 1024 } as Awaited<ReturnType<typeof stat>>);

    await expect(verifyOutput(FAKE_PATH)).rejects.toThrow(/missing an sRGB color-space chunk/);
  });

  it('(b) 1200×630 PNG at 400 KB — throws with message containing "300 KB" or byte count', async () => {
    const buf = makePngHeaderWithSrgb(1200, 630);
    readFileMock.mockResolvedValue(buf as unknown as Awaited<ReturnType<typeof readFile>>);
    statMock.mockResolvedValue({ size: 400 * 1024 } as Awaited<ReturnType<typeof stat>>);

    await expect(verifyOutput(FAKE_PATH)).rejects.toThrow(/300 KB|409600/);
  });

  it('(c) 2400×1200 PNG — throws with message containing the wrong dims', async () => {
    const buf = makePngHeader(2400, 1200);
    readFileMock.mockResolvedValue(buf as unknown as Awaited<ReturnType<typeof readFile>>);
    // stat is never reached because the dimension check throws first
    statMock.mockResolvedValue({ size: 100 * 1024 } as Awaited<ReturnType<typeof stat>>);

    await expect(verifyOutput(FAKE_PATH)).rejects.toThrow(/2400/);
    await expect(verifyOutput(FAKE_PATH)).rejects.toThrow(/1200/);
  });

  it('(d) missing PNG signature — throws "not a valid PNG"', async () => {
    // Buffer with wrong first byte — not a valid PNG signature.
    const badBuf = Buffer.alloc(33, 0x00);
    readFileMock.mockResolvedValue(badBuf as unknown as Awaited<ReturnType<typeof readFile>>);

    await expect(verifyOutput(FAKE_PATH)).rejects.toThrow(/not a valid PNG/);
  });

  it('(e) missing file — throws', async () => {
    readFileMock.mockRejectedValue(
      Object.assign(new Error('ENOENT: no such file or directory'), { code: 'ENOENT' }),
    );

    await expect(verifyOutput(FAKE_PATH)).rejects.toThrow();
  });
});
