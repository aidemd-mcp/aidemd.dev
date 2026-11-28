import type { ReactNode } from "react";
import TopBar from "@/app/_components/TopBar";
import Footer from "@/app/_components/Footer";

interface LearnLayoutProps {
  children: ReactNode;
}

/**
 * /learn section layout: skip link, sticky site TopBar, one centred docs
 * reading column, site Footer.
 *
 * Not the docs layout: that shell carries the docs sidebar and drawer, and
 * docsRegistry renders package markdown only, which /learn is not. Not the
 * /brain layout either: /brain scopes its own palette and ships its own
 * footer. /learn reuses the site chrome and the docs reading-column values
 * (padding 40 / 80, max-width 1000, px 20 / md 64) so it introduces no new
 * spacing. No `active` on the TopBar: /learn is not a nav destination.
 *
 * Server component; nothing under src/app/learn is a client component.
 */
export default function LearnLayout({ children }: LearnLayoutProps) {
  return (
    <div className="min-h-screen bg-[color:var(--color-bg)] text-[color:var(--color-fg)]">
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <TopBar sticky />
      <main id="main" className="flex justify-center pt-[40px] pb-[80px]">
        <div className="w-full max-w-[1000px] px-[20px] md:px-[64px]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
