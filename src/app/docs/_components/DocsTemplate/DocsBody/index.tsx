'use client';

import type { MouseEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { LinkClick } from '@/types/linkClick';
import resolveClientHref from './resolveClientHref';

/**
 * Renders the Shiki-highlighted markdown body of a docs page.
 * Body links are plain anchors from rendered markdown; one delegated click handler sends
 * internal ones through the client router so the persistent docs layout and its sidebar
 * scroll survive navigation. The decision lives in `resolveClientHref`; anything it
 * declines (new tab, download, external, `#hash`) is left to the browser.
 */
export default function DocsBody({ html }: { html: string }) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    if (!(event.target instanceof Element)) return;
    const anchor = event.target.closest('a');
    if (!anchor) return;

    const click: LinkClick = {
      defaultPrevented: event.defaultPrevented,
      button: event.button,
      metaKey: event.metaKey,
      ctrlKey: event.ctrlKey,
      shiftKey: event.shiftKey,
      altKey: event.altKey,
      target: anchor.getAttribute('target'),
      download: anchor.hasAttribute('download'),
      href: anchor.getAttribute('href'),
      origin: window.location.origin,
    };

    const path = resolveClientHref(click);
    if (path === undefined) return;

    event.preventDefault();
    router.push(path);
  }

  return (
    <div
      className="docs-body"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
