import { describe, it, expect } from 'vitest';
import { crc32 } from 'node:zlib';
import tagSrgb from './index';

/** Builds a 33-byte PNG prefix (signature + IHDR chunk) followed by a fake IDAT/IEND tail. */
function makeUntaggedPng(): Buffer {
  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(25, 0x07);
  ihdr.writeUInt32BE(13, 0);
  ihdr.write('IHDR', 4, 'ascii');
  const tail = Buffer.from('IDAT-and-IEND-bytes', 'ascii');
  return Buffer.concat([signature, ihdr, tail]);
}

describe('tagSrgb', () => {
  const input = makeUntaggedPng();
  const output = tagSrgb(input);

  it('returns a buffer 13 bytes longer than the input', () => {
    expect(output.length).toBe(input.length + 13);
  });

  it('leaves bytes 0-32 (signature + IHDR) unchanged', () => {
    expect(output.subarray(0, 33).equals(input.subarray(0, 33))).toBe(true);
  });

  it('inserts an sRGB chunk at bytes 33-45 with perceptual intent and a correct CRC', () => {
    const chunk = output.subarray(33, 46);
    expect(chunk.readUInt32BE(0)).toBe(1);
    expect(chunk.subarray(4, 8).toString('ascii')).toBe('sRGB');
    expect(chunk[8]).toBe(0);
    const expectedCrc = crc32(Buffer.concat([Buffer.from('sRGB', 'ascii'), Buffer.from([0])])) >>> 0;
    expect(chunk.readUInt32BE(9)).toBe(expectedCrc);
  });

  it('keeps the remainder of the input after the inserted chunk', () => {
    expect(output.subarray(46).equals(input.subarray(33))).toBe(true);
  });
});
