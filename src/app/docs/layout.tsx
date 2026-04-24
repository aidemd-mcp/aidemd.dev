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
 *   - flex row: 280px DocsSidebar flush with viewport-left edge (desktop,
 *     hidden md:block), then flex-1 main that centers its 1000px prose column.
 *     Below md: single-column; sidebar becomes a drawer overlay toggled by
 *     the hamburger in the TopBar.
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
        {/*
         * Wide-viewport layout: sidebar anchored to viewport-left edge, main
         * centered at 1000px with its own margins — GitHub-docs pattern.
         *
         * At desktop (md+): flex row.
         *   - Sidebar aside (inside DocsSidebar) is 280px wide, position:sticky,
         *     flexShrink:0 — it sits flush with the viewport-left edge because
         *     there is no centering container above it.
         *   - Main gets flex:1 + flex justify-center so the 1000px prose block
         *     centers within the remaining viewport width.
         *
         * At mobile (<md): single column; sidebar collapses to drawer overlay.
         */}
        <div
          className="flex"
          style={{ minHeight: 'calc(100vh - 44px)' }}
        >
          <Suspense fallback={<div className="hidden md:block flex-shrink-0" style={{ width: 280 }} />}>
            <DocsSidebar />
          </Suspense>
          <main
            className="flex-1 min-w-0 flex justify-center"
            style={{ paddingTop: 40, paddingBottom: 80 }}
          >
            <div
              className="w-full px-[20px] md:px-[64px]"
              style={{ maxWidth: 1000 }}
            >
              {children}
            </div>
          </main>
        </div>
      </div>
    </DocsDrawerProvider>
  );
}
