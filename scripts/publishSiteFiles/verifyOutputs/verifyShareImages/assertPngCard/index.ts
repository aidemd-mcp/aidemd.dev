import fileError from '../../shared/fileError';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const CARD_WIDTH = 1200;
const CARD_HEIGHT = 630;

/**
 * Throws unless the bytes are a PNG whose IHDR reports the 1200 by 630 share card
 * size. Reads only the signature and the IHDR chunk, so a header-only buffer passes.
 */
export default function assertPngCard({ file, bytes }: { file: string; bytes: Buffer }): void {
  if (bytes.length < 24 || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw fileError(file, 'is not a PNG (bad signature)');
  }
  if (bytes.toString('ascii', 12, 16) !== 'IHDR') throw fileError(file, 'is not a PNG (no IHDR chunk)');

  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width !== CARD_WIDTH || height !== CARD_HEIGHT) {
    throw fileError(file, `is ${width}x${height}, expected ${CARD_WIDTH}x${CARD_HEIGHT}`);
  }
}
