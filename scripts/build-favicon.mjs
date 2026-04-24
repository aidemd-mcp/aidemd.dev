import sharp from 'sharp';
import toIco from 'to-ico';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(here, '../public/sticker_transparent.png');
const out = path.resolve(here, '../src/app/favicon.ico');

const trimmed = await sharp(src).trim().toBuffer();
const meta = await sharp(trimmed).metadata();
const side = Math.max(meta.width, meta.height);

const square = await sharp(trimmed)
  .resize(side, side, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toBuffer();

const sizes = [16, 32, 48];
const pngs = await Promise.all(
  sizes.map((s) =>
    sharp(square).resize(s, s, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer(),
  ),
);

const ico = await toIco(pngs);
await writeFile(out, ico);

console.log(`favicon.ico written — ${sizes.join('/')} px, ${ico.length} bytes → ${out}`);
