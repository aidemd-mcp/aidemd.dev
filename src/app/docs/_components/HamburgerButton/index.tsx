'use client';

import { useDocsDrawer } from '../DocsDrawerContext';

/**
 * Hamburger button for the docs-variant TopBar. Rendered block md:hidden so
 * it only appears at small viewports. Calls DocsDrawerContext.open() to show
 * the sidebar drawer overlay.
 *
 * Placed as a sibling to TopBar inside ActiveAwareTopBar so it shares the
 * same client-component boundary without adding props to TopBar itself.
 */
export default function HamburgerButton() {
  const { open } = useDocsDrawer();

  return (
    <button
      onClick={open}
      aria-label="Open navigation menu"
      style={{
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'var(--color-dim)',
        padding: '8px',
        lineHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
      }}
    >
      <span
        style={{
          display: 'block',
          width: 16,
          height: 1.5,
          background: 'var(--color-dim)',
          borderRadius: 1,
        }}
      />
      <span
        style={{
          display: 'block',
          width: 16,
          height: 1.5,
          background: 'var(--color-dim)',
          borderRadius: 1,
        }}
      />
      <span
        style={{
          display: 'block',
          width: 16,
          height: 1.5,
          background: 'var(--color-dim)',
          borderRadius: 1,
        }}
      />
    </button>
  );
}
