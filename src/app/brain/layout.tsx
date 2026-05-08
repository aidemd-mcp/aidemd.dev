import TopBar from "@/app/_components/TopBar";
import BrainFooter from "./_components/BrainFooter";

/**
 * Brain-section layout — wraps /brain and /brain/recipes.
 *
 * Structure:
 *   <div className="brain-pal">          ← palette-scope: resolves --brain-* CSS vars
 *     <a href="#main" className="skip-link">  ← WCAG 2.4.1 skip-to-main (first child)
 *     <TopBar sticky />                  ← position:sticky top-0 z-10, 44px
 *     <main id="main">{children}</main>  ← no max-width here; each route owns its own
 *     <BrainFooter />                    ← simple attribution footer, section-scoped
 *   </div>
 *
 * The global <Footer /> is NOT rendered here — it lives at the page level
 * (src/app/page.tsx inside <main>), not in the root layout, so there is no
 * conflict: the brain layout and the root layout are independent.
 *
 * No 'use client' — server component.
 */
export default function BrainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="brain-pal">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <TopBar sticky active="brain" />
      <main id="main">{children}</main>
      <BrainFooter />
    </div>
  );
}
