import siteIdentity from '@/data/siteIdentity';
import fileError from '../shared/fileError';

const FILE = '.well-known/security.txt';
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** The value of the first `<field>: ` line, or undefined when the field is absent. */
function fieldValue({ text, field }: { text: string; field: string }): string | undefined {
  const prefix = `${field}: `;
  return text
    .split('\n')
    .find((line) => line.startsWith(prefix))
    ?.slice(prefix.length);
}

/**
 * Checks security.txt as read back from disk. It must carry a `Contact:` line equal
 * to the site identity's security contact (an https: or mailto: address), an
 * `Expires:` line that parses as a date 179 to 181 days after `now`, and a
 * `Canonical:` line. Throws naming the broken rule.
 */
export default function verifySecurityTxt({ text, now }: { text: string; now: Date }): void {
  if (text.trim() === '') throw fileError(FILE, 'is empty');

  const contact = fieldValue({ text, field: 'Contact' });
  if (contact === undefined) throw fileError(FILE, 'has no Contact line');
  if (!siteIdentity.securityContact.startsWith('https://') && !siteIdentity.securityContact.startsWith('mailto:')) {
    throw fileError(FILE, 'the site identity security contact is neither an https: nor a mailto: address');
  }
  if (contact !== siteIdentity.securityContact) {
    throw fileError(FILE, `Contact is ${contact}, the site identity says ${siteIdentity.securityContact}`);
  }

  const expires = fieldValue({ text, field: 'Expires' });
  if (expires === undefined) throw fileError(FILE, 'has no Expires line');
  const expiresTime = Date.parse(expires);
  if (Number.isNaN(expiresTime)) throw fileError(FILE, `Expires is not a date: ${expires}`);
  const days = (expiresTime - now.getTime()) / MS_PER_DAY;
  if (days < 179 || days > 181) throw fileError(FILE, `Expires is ${days.toFixed(1)} days out, expected about 180`);

  const canonical = fieldValue({ text, field: 'Canonical' });
  if (canonical === undefined || canonical === '') throw fileError(FILE, 'has no Canonical line');
}
