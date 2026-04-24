'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { DocRoute, DocSection } from '@/types/docs';

interface GroupedRoutes {
  section: DocSection;
  label: string;
  routes: DocRoute[];
}

interface SidebarShellProps {
  groupedRoutes: GroupedRoutes[];
}

const VALID_SECTIONS = new Set<string>(['methodology', 'commands', 'agents', 'skills']);

/**
 * Client component that renders the sidebar shell with active-state highlighting.
 * Reads usePathname() to determine which section and route are currently active.
 *
 * Active-row rule (load-bearing):
 *   - Leaf page (/docs/agents/aide-architect/): current = 'agents/aide-architect' → exact match highlights that SidebarRow.
 *   - Section-index (/docs/agents/): no specific SidebarRow is highlighted; only the CategoryBlock header is accented.
 *   - /docs/ index: no active section, no active row.
 *
 * CategoryBlock header is accent-colored when its section matches the active section.
 */
export default function SidebarShell({ groupedRoutes }: SidebarShellProps) {
  const pathname = usePathname();

  // Derive activeSection and current from pathname.
  // /docs/agents/aide-architect/ → section='agents', slug='aide-architect'
  // /docs/agents/ → section='agents', slug=undefined
  // /docs/ → both undefined
  const parts = pathname.replace(/\/$/, '').split('/').filter(Boolean);
  // parts[0]='docs', parts[1]=section, parts[2..n]=slug segments
  const sectionPart = parts[1];
  // Join all segments after the section to support nested slugs (e.g. 'aide/align')
  const slugPart = parts.slice(2).join('/') || undefined;

  const activeSection: DocSection | undefined =
    sectionPart && VALID_SECTIONS.has(sectionPart) ? (sectionPart as DocSection) : undefined;
  const currentKey: string | undefined =
    activeSection && slugPart ? `${activeSection}/${slugPart}` : undefined;

  return (
    <aside
      aria-label="Documentation"
      style={{
        width: 280,
        borderRight: '1px solid var(--color-border)',
        padding: '28px 0',
        background: 'var(--color-bg)',
        position: 'sticky',
        top: 44,
        height: 'calc(100vh - 44px)',
        overflowY: 'auto',
        flexShrink: 0,
      }}
    >
      <nav aria-label="Documentation sections">
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
                    <span>{route.slug.replace(/\//g, ' / ')}</span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Expo teach-pose promo card */}
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
              <em style={{ color: 'var(--color-accent)', fontStyle: 'normal' }}>byte-faithful</em>{' '}
              render of the source file in your <code>.aide/</code> hub.
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          margin: '20px 24px 0',
          fontSize: 10,
          color: 'var(--color-dim-2)',
          lineHeight: 1.8,
        }}
      >
        <div># tip: every page has a</div>
        <div># commit hash for citation.</div>
      </div>
    </aside>
  );
}
