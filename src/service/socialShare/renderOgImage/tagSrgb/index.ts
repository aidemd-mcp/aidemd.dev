import { readFile, writeFile } from 'node:fs/promises';
import { crc32 } from 'node:zlib';

/** Byte offset where the IHDR chunk begins (immediately after the 8-byte PNG signature). */
const IHDR_OFFSET = 8;

/**
 * Byte length of a complete IHDR chunk:
 *   4 (length field) + 4 (type) + 13 (data) + 4 (CRC) = 25 bytes.
 */
const IHDR_CHUNK_LENGTH = 25;

/** Byte offset immediately after the IHDR chunk — where sRGB is injected. */
const SRGB_INSERT_OFFSET = IHDR_OFFSET + IHDR_CHUNK_LENGTH;

/** PNG sRGB rendering intent: 0 = Perceptual. */
const SRGB_RENDERING_INTENT = 0x00;

/**
 * Builds the 13-byte sRGB chunk binary:
 *   [4 bytes] length field  → 0x00000001 (the chunk data is 1 byte)
 *   [4 bytes] chunk type    → ASCII "sRGB"
 *   [1 byte]  rendering intent → 0x00 (Perceptual)
 *   [4 bytes] CRC32         → computed over type + data at runtime
 *
 * The CRC is computed at call time (not hard-coded) so that any future
 * change to the rendering intent byte automatically produces the correct
 * checksum without a manual constant update.
 */
function buildSrgbChunk(): Buffer {
  const typeBytes = Buffer.from('sRGB', 'ascii');
  const dataBytes = Buffer.from([SRGB_RENDERING_INTENT]);

  const crcInput = Buffer.concat([typeBytes, dataBytes]);
  const crcValue = crc32(crcInput) >>> 0; // force unsigned 32-bit

  const chunk = Buffer.alloc(4 + 4 + 1 + 4);
  chunk.writeUInt32BE(1, 0);           // length: 1 byte of data
  typeBytes.copy(chunk, 4);            // type: "sRGB"
  chunk[8] = SRGB_RENDERING_INTENT;   // data: rendering intent
  chunk.writeUInt32BE(crcValue, 9);   // CRC32 over type + data

  return chunk;
}

/**
 * Post-processes the PNG at `pngPath` to insert an sRGB color-space chunk
 * immediately after the IHDR chunk.
 *
 * Playwright's `page.locator('.og').screenshot({ type: 'png' })` emits an
 * untagged PNG — no sRGB, gAMA, or iCCP chunk. The spec's
 * `outcomes.desired[0]` and `outcomes.undesired[0]` both name sRGB as a
 * hard requirement. This helper satisfies that requirement without an image
 * library: it reads the raw PNG bytes, splices the 13-byte sRGB chunk
 * between the IHDR and the next chunk, and overwrites the file.
 *
 * No image-processing library is used — only raw Buffer operations and
 * `node:zlib`'s built-in `crc32`. This follows the same discipline as
 * `verifyOutput`, which also parses PNG structure via raw buffer reads.
 *
 * @param pngPath - Absolute filesystem path of the PNG file to tag in-place.
 */
export default async function tagSrgb(pngPath: string): Promise<void> {
  const original = await readFile(pngPath);
  const srgbChunk = buildSrgbChunk();

  const before = original.subarray(0, SRGB_INSERT_OFFSET);
  const after = original.subarray(SRGB_INSERT_OFFSET);

  const tagged = Buffer.concat([before, srgbChunk, after]);
  await writeFile(pngPath, tagged);
}
