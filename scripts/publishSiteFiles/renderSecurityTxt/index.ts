import siteIdentity from '@/data/siteIdentity';

const EXPIRY_DAYS = 180;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/**
 * Renders /.well-known/security.txt: the contact from the site identity, an
 * expiry 180 days after the build, the canonical location and the language.
 * `now` is the only clock input; the expiry is a policy deadline, not a page date.
 */
export default function renderSecurityTxt(now: Date): string {
  const expires = new Date(now.getTime() + EXPIRY_DAYS * MS_PER_DAY).toISOString();
  return [
    `Contact: ${siteIdentity.securityContact}`,
    `Expires: ${expires}`,
    `Canonical: ${siteIdentity.url}/.well-known/security.txt`,
    'Preferred-Languages: en',
    '',
  ].join('\n');
}
