'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { DocRoute, DocSection } from '@/types/docs';
import { useDocsDrawer } from '../DocsDrawerContext';

interface GroupedRoutes {
  section: DocSection;
  label: string;
  routes: DocRoute[];
}

interface DocsSidebarDrawerProps {
  groupedRoutes: GroupedRoutes[];
}

const VALID_SECTIONS = new Set<string>(['methodology', 'commands', 'agents', 'skills']);

/**
 * Mobile sidebar drawer — rendered block md:hidden. Slides in from the left
 * as an overlay. Body scroll is locked while open. Closes on backdrop click,
 * close-button click, or after navigating to a new doc (pathname changes).
 *
 * Content mirrors SidebarShell: same CategoryBlock + SidebarRow rendering,
 * same active-row logic driven by usePathname(). Open/close state is shared
 * via DocsDrawerContext so the hamburger in TopBar can trigger it.
 */
export default function DocsSidebarDrawer({ groupedRoutes }: DocsSidebarDrawerProps) {
  const { isOpen, close } = useDocsDrawer();
  const pathname = usePathname();

  // Derive active state from pathname (same logic as SidebarShell)
  const parts = pathname.replace(/\/$/, '').split('/').filter(Boolean);
  const sectionPart = parts[1];
  // Join all segments after the section to support nested slugs (e.g. 'aide/align')
  const slugPart = parts.slice(2).join('/') || undefined;

  const activeSection: DocSection | undefined =
    sectionPart && VALID_SECTIONS.has(sectionPart) ? (sectionPart as DocSection) : undefined;
  const currentKey: string | undefined =
    activeSection && slugPart ? `${activeSection}/${slugPart}` : undefined;

  // Close drawer when pathname changes (user navigated to a doc)
  useEffect(() => {
    close();
  }, [pathname, close]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape key — dialog-pattern keyboard contract (WCAG 2.1 / ARIA dialog)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    // Only show below md breakpoint
    <div className="block md:hidden">
      {/* Backdrop */}
      <div
        role="presentation"
        onClick={close}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.55)',
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="docs-drawer-title"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
          width: 280,
          background: 'var(--color-bg)',
          borderRight: '1px solid var(--color-border)',
          overflowY: 'auto',
          padding: '0 0 28px',
        }}
      >
        {/* Drawer header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            borderBottom: '1px solid var(--color-border)',
            height: 44,
          }}
        >
          <span
            id="docs-drawer-title"
            style={{
              fontSize: 12,
              color: 'var(--color-dim)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            aidemd.dev — docs
          </span>
          <button
            onClick={close}
            aria-label="Close navigation menu"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-dim)',
              fontSize: 18,
              lineHeight: 1,
              padding: '4px 6px',
            }}
          >
            ×
          </button>
        </div>

        {/* Category groups */}
        <nav aria-label="Documentation sections" style={{ paddingTop: 8 }}>
          {groupedRoutes.map(({ section, label, routes }) => {
            const isActiveSection = activeSection === section;
            return (
              <div key={section}>
                {/* Section header */}
                <h2
                  style={{
                    padding: '0 24px 8px',
                    fontSize: 11,
                    color: isActiveSection ? 'var(--color-accent)' : 'var(--color-dim-text)',
                    letterSpacing: 1.5,
                    textTransform: 'uppercase',
                    margin: '20px 0 0',
                    fontWeight: 'inherit',
                  }}
                >
                  # {label}
                </h2>

                {/* Route rows */}
                {routes.map((route, i) => {
                  const routeKey = `${route.section}/${route.slug}`;
                  const isActive = currentKey === routeKey;
                  return (
                    <Link
                      key={routeKey}
                      href={route.urlPath}
                      aria-current={isActive ? 'page' : undefined}
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 12,
                        padding: '7px 24px',
                        fontSize: 13,
                        color: isActive ? 'var(--color-accent)' : 'var(--color-fg)',
                        background: isActive ? 'rgba(61,107,74,0.12)' : 'transparent',
                        borderLeft: `2px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
                        textDecoration: 'none',
                      }}
                    >
                      <span
                        style={{
                          color: 'var(--color-dim-text)',
                          width: 14,
                          flexShrink: 0,
                          fontSize: 11,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span>{route.slug}.md</span>
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Expo promo card */}
        <div
          style={{
            margin: '28px 24px 0',
            padding: '16px 14px',
            background: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: 6,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/expo-teach.png"
              alt="Expo mascot"
              width={58}
              style={{
                marginTop: -22,
                marginLeft: -4,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.4))',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--color-accent)', marginBottom: 4 }}>
                Expo says:
              </div>
              <div style={{ fontSize: 11, color: 'var(--color-fg)', lineHeight: 1.5 }}>
                Every page here is a{' '}
                <em style={{ color: 'var(--color-accent)', fontStyle: 'normal' }}>
                  byte-faithful
                </em>{' '}
                render of the source file in your <code>.aide/</code> hub.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
