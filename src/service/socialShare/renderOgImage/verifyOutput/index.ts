import { readFile, stat } from 'node:fs/promises';

/** Maximum permitted byte size for og.png (300 × 1024 = 307 200 bytes). */
const MAX_BYTES = 300 * 1024;

/** Expected pixel width of the OG image per spec. */
const EXPECTED_WIDTH = 1200;

/** Expected pixel height of the OG image per spec. */
const EXPECTED_HEIGHT = 630;

/** PNG file signature — first 8 bytes of every valid PNG. */
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

/**
 * Walks the PNG chunk sequence starting after the IHDR chunk and returns
 * true if at least one sRGB or iCCP chunk is present.
 *
 * PNG chunk structure: [4 bytes length][4 bytes type][<length> bytes data][4 bytes CRC].
 * Walking starts at byte 33 (8-byte signature + 25-byte IHDR chunk) and
 * continues until the IEND chunk sentinel or buffer exhaustion.
 *
 * No image-processing library — raw Buffer reads only.
 */
function hasSrgbColorSpace(buffer: Buffer): boolean {
  // Byte 33 = 8 (sig) + 4 (IHDR length field) + 4 (IHDR type) + 13 (IHDR data) + 4 (IHDR CRC)
  let offset = 33;

  while (offset + 8 <= buffer.length) {
    const chunkDataLength = buffer.readUInt32BE(offset);
    const chunkType = buffer.subarray(offset + 4, offset + 8).toString('ascii');

    if (chunkType === 'sRGB' || chunkType === 'iCCP') {
      return true;
    }

    if (chunkType === 'IEND') {
      break;
    }

    // Advance past: 4 (length) + 4 (type) + chunkDataLength (data) + 4 (CRC)
    offset += 4 + 4 + chunkDataLength + 4;
  }

  return false;
}

/**
 * Reads the PNG at `outPath`, validates its signature, parses the IHDR chunk
 * to extract pixel dimensions, checks the byte size against the 300 KB
 * ceiling mandated by the spec, and asserts that an sRGB color-space chunk
 * (sRGB or iCCP) is present in the chunk sequence.
 *
 * No image-processing library is used — only raw Buffer reads and `fs.stat`.
 * This keeps the render pipeline free of native build steps while still
 * enforcing every constraint in the spec's `outcomes.desired`.
 *
 * Throws a descriptive error if any of the following conditions are met:
 *   - The file is missing or unreadable.
 *   - The first 8 bytes do not match the PNG signature.
 *   - The parsed width is not 1200 or the parsed height is not 630.
 *   - The file size exceeds 307 200 bytes (300 KB).
 *   - No sRGB or iCCP chunk is found in the PNG chunk sequence — the file is
 *     color-space-untagged, violating `outcomes.desired[0]` and triggering
 *     the silent-downgrade scenario named in `outcomes.undesired[0]`.
 *
 * @param outPath - Absolute path to the PNG file to verify.
 * @returns The verified metrics: bytes on disk, pixel width, and pixel height.
 */
export default async function verifyOutput(
  outPath: string,
): Promise<{ bytes: number; width: number; height: number }> {
  const buffer = await readFile(outPath);

  const signature = buffer.subarray(0, 8);
  if (!signature.equals(PNG_SIGNATURE)) {
    throw new Error('og.png is not a valid PNG — signature mismatch');
  }

  // PNG structure: 8-byte signature, then chunks. The first chunk is always
  // IHDR (13 bytes of data). IHDR layout: 4 bytes length, 4 bytes type, then
  // data starting at byte 16. Width is at bytes 16–19, height at 20–23,
  // both big-endian uint32.
  const width = buffer.readUInt32BE(16);
  const height = buffer.readUInt32BE(20);

  if (width !== EXPECTED_WIDTH || height !== EXPECTED_HEIGHT) {
    throw new Error(
      `og.png dimensions ${width}×${height}, expected ${EXPECTED_WIDTH}×${EXPECTED_HEIGHT}`,
    );
  }

  const { size: bytes } = await stat(outPath);

  if (bytes > MAX_BYTES) {
    throw new Error(
      `og.png exceeds 300 KB ceiling — got ${bytes} bytes (limit ${MAX_BYTES})`,
    );
  }

  if (!hasSrgbColorSpace(buffer)) {
    throw new Error(
      'og.png is missing an sRGB color-space chunk (sRGB or iCCP) — ' +
        'Playwright default PNG output is untagged; run captureOgElement which ' +
        'calls tagSrgb to inject the chunk after capture',
    );
  }

  return { bytes, width, height };
}
