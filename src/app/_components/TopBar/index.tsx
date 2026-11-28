"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import cn from "@/lib/cn";
import navLinks from "@/data/navLinks";
import TrafficLights from "./TrafficLights";

type ActivePage = "docs" | "brain" | "observer";

interface TopBarProps {
  active?: ActivePage;
  /** When true, the bar becomes position:sticky top-0 z-10 with a fixed 44px height. */
  sticky?: boolean;
  /**
   * When provided, renders a hamburger button inside the nav area at mobile
   * (block md:hidden). Used by the docs-variant TopBar to open the sidebar drawer.
   * Never used by the marketing TopBar.
   */
  hamburgerSlot?: React.ReactNode;
}

/**
 * Marketing top-bar with terminal window chrome.
 * In the docs layout (step 9) this becomes sticky; for the marketing
 * variant it is non-sticky.
 *
 * Five nav entries in order (from `@/data/navLinks`): docs, brain, observer, github ↗, npm ↗.
 * Responsive: external links (github ↗, npm ↗) are hidden below the md: breakpoint.
 * `docs`, `brain` and `observer` remain visible at every viewport — mobile parity required.
 * The `aidemd.dev — zsh` label also hides at the smallest sizes to save space.
 * The home link is named by its visible label (WCAG 2.5.3), with an sr-only name below md.
 *
 * In the docs layout, `hamburgerSlot` is rendered inside the nav area at mobile
 * (block md:hidden) so the hamburger appears after the last mobile-visible link.
 */
export default function TopBar({ active, sticky, hamburgerSlot }: TopBarProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isDocs = pathname === "/docs" || pathname.startsWith("/docs/");
  const isBrain = pathname === "/brain" || pathname.startsWith("/brain/");
  const isObserver = pathname === "/observer" || pathname.startsWith("/observer/");
  return (
    <header
      className="w-full bg-[color:var(--color-card)] border-b border-[color:var(--color-border)]"
      style={sticky ? { position: 'sticky', top: 0, zIndex: 10, height: 44 } : undefined}
      aria-label="Site header"
    >
      {/* Inner wrapper: edge-anchored, no max-width cap — GitHub top-bar pattern. */}
      <div className="flex items-center gap-[10px] px-[16px] py-[10px] h-full">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-accent)] rounded-sm"
        >
          <TrafficLights />
          {isDocs ? (
            <span className="ml-[18px] text-[12px] hidden md:inline">
              <span style={{ color: "var(--color-accent)" }} aria-hidden="true">$</span>
              {" "}aidemd.dev
              <span style={{ color: "var(--color-dim)" }}>/docs</span>
            </span>
          ) : isBrain ? (
            <span className="ml-[18px] text-[12px] hidden md:inline">
              <span style={{ color: "var(--color-accent)" }} aria-hidden="true">$</span>
              {" "}aidemd.dev
              <span style={{ color: "var(--color-dim)" }}>/brain</span>
            </span>
          ) : isObserver ? (
            <span className="ml-[18px] text-[12px] hidden md:inline">
              <span style={{ color: "var(--color-accent)" }} aria-hidden="true">$</span>
              {" "}aidemd.dev
              <span style={{ color: "var(--color-dim)" }}>/observer</span>
            </span>
          ) : (
            <span
              className={cn(
                "ml-[18px] text-[12px] hidden md:inline",
                isHome
                  ? "text-[color:var(--color-fg)]"
                  : "text-[color:var(--color-dim)]",
              )}
            >
              aidemd.dev — zsh
            </span>
          )}
          <span className="sr-only md:hidden">aidemd.dev</span>
        </Link>
        <nav
          className="ml-auto flex items-center gap-[20px] text-[11px] text-[color:var(--color-dim)]"
          aria-label="Main navigation"
        >
          {navLinks.map(({ label, href, external, mobileVisible }) => {
            const isActive =
              !external && (active as string) === label;
            const visibilityClass = mobileVisible ? "" : "hidden md:inline";
            return external ? (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn("hover:text-[color:var(--color-fg)] transition-colors", visibilityClass)}
              >
                {label}
              </a>
            ) : (
              <Link
                key={label}
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  "hover:text-[color:var(--color-fg)] transition-colors pb-[2px]",
                  isActive
                    ? "text-[color:var(--color-fg)] border-b-2 border-[color:var(--color-accent)]"
                    : "",
                  visibilityClass,
                )}
              >
                {label}
              </Link>
            );
          })}
          {/* Hamburger slot: only rendered in docs variant, only visible below md: */}
          {hamburgerSlot && (
            <div className="md:hidden">
              {hamburgerSlot}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
