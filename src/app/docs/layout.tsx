import { Suspense, type ReactNode } from 'react';
import ActiveAwareTopBar from './_components/ActiveAwareTopBar';
import DocsSidebar from './_components/DocsSidebar';
import { DocsDrawerProvider } from './_components/DocsDrawerContext';

interface DocsLayoutProps {
  children: ReactNode;
}

/**
 * Docs shell layout. Structure:
 *   - DocsDrawerProvider: client context that holds the sidebar drawer open/close
 *     state, shared between the hamburger button (in ActiveAwareTopBar) and the
 *     DocsSidebarDrawer rendered inside DocsSidebar.
 *   - ActiveAwareTopBar: sticky client component that reads usePathname() and
 *     derives the active TopBar nav entry (docs | agents | skills | commands).
 *     At mobile breakpoints it also renders a hamburger button overlay.
 *   - 2-column grid: 280px DocsSidebar (desktop, hidden md:block) + 1fr main.
 *     Below md: the grid collapses to a single column; the sidebar becomes a
 *     drawer overlay toggled by the hamburger in the TopBar.
 *
 * DocsSidebar computes activeSection and current internally via usePathname()
 * in its SidebarShell client sub-component — the layout itself does not
 * compute pathname (it's a server component).
 */
export default function DocsLayout({ children }: DocsLayoutProps) {
  return (
    <DocsDrawerProvider>
      <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
        <ActiveAwareTopBar />
        <div
          className="md:grid"
          style={{
            gridTemplateColumns: '280px 1fr',
            minHeight: 'calc(100vh - 44px)',
          }}
        >
          <Suspense fallback={<div className="hidden md:block" style={{ width: 280 }} />}>
            <DocsSidebar />
          </Suspense>
          <main
            className="px-[20px] md:px-[64px]"
            style={{
              paddingTop: 40,
              paddingBottom: 80,
              maxWidth: 1000,
              width: '100%',
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </DocsDrawerProvider>
  );
}
