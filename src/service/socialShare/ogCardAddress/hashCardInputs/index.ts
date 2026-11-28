import { createHash } from 'node:crypto';

/**
 * Fingerprints what one page card shows: the design source plus the page's
 * title and section. The first 10 hex characters go into the card's address, so
 * a renamed page gets a new address and an unchanged page keeps its own.
 */
export default function hashCardInputs({
  designHash,
  title,
  section,
}: {
  designHash: string;
  title: string;
  section?: string;
}): string {
  return createHash('sha256')
    .update(JSON.stringify([designHash, title, section ?? null]))
    .digest('hex')
    .slice(0, 10);
}
