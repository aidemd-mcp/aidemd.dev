import { DOCS_CATEGORIES } from '@/data/docsCategories';
import type { DocRoute, DocSection } from '@/types/docs';
import buildRegistry from '@/service/docsRegistry';
import SidebarShell from './SidebarShell';
import DocsSidebarDrawer from '../DocsSidebarDrawer';

/**
 * Server-side orchestrator: fetches the full route registry and passes the
 * grouped routes to SidebarShell (a client component that reads usePathname()
 * to determine active state) and DocsSidebarDrawer (the mobile drawer overlay).
 *
 * Split rationale: registry fetching is async and must happen server-side;
 * active-state detection requires usePathname() which is client-only.
 * The server fetches, the client highlights — no pathname computation in this file.
 *
 * Responsive layout:
 *   - SidebarShell wrapper: hidden md:block (desktop only)
 *   - DocsSidebarDrawer: block md:hidden (mobile overlay, controlled by DocsDrawerContext)
 */
export default async function DocsSidebar() {
  const { routes } = await buildRegistry();

  const groupedRoutes: { section: DocSection; label: string; routes: DocRoute[] }[] =
    DOCS_CATEGORIES.map((cat) => ({
      section: cat.section,
      label: cat.label,
      routes: routes.filter((r) => r.section === cat.section),
    }));

  return (
    <>
      {/* Desktop: sticky left column, hidden below md:; flex-shrink-0 prevents
          compression inside the flex row in docs/layout.tsx */}
      <div className="hidden md:block flex-shrink-0">
        <SidebarShell groupedRoutes={groupedRoutes} />
      </div>

      {/* Mobile: drawer overlay, only shown below md: */}
      <DocsSidebarDrawer groupedRoutes={groupedRoutes} />
    </>
  );
}
