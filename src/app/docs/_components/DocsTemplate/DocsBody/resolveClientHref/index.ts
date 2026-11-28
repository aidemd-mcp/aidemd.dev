import type { LinkClick } from '@/types/linkClick';

/**
 * The click decision for links inside a docs page body.
 * Returns the root-relative path (pathname + search + hash) to push through the client router,
 * or `undefined` to let the browser handle the click itself.
 */
export default function resolveClientHref(click: LinkClick): string | undefined {
  if (click.defaultPrevented) return undefined;
  if (click.button !== 0) return undefined;
  if (click.metaKey || click.ctrlKey || click.shiftKey || click.altKey) return undefined;
  if (click.target && click.target !== '_self') return undefined;
  if (click.download) return undefined;
  if (!click.href) return undefined;
  if (click.href.startsWith('#')) return undefined;

  let resolved: URL;
  try {
    resolved = new URL(click.href, click.origin);
  } catch {
    return undefined;
  }
  if (resolved.origin !== click.origin) return undefined;

  return resolved.pathname + resolved.search + resolved.hash;
}
