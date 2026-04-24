import Link from "next/link";
import cn from "@/lib/cn";
import TrafficLights from "./TrafficLights";

type ActivePage = "docs" | "agents" | "skills" | "commands";

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

const NAV_LINKS = [
  { label: "docs", href: "/docs", external: false, mobileVisible: true },
  { label: "agents", href: "/docs/agents", external: false, mobileVisible: false },
  { label: "skills", href: "/docs/skills", external: false, mobileVisible: false },
  { label: "commands", href: "/docs/commands", external: false, mobileVisible: false },
  {
    label: "github ↗",
    href: "https://github.com/aidemd-mcp/server",
    external: true,
    mobileVisible: false,
  },
  {
    label: "npm ↗",
    href: "https://www.npmjs.com/package/@aidemd-mcp/server",
    external: true,
    mobileVisible: false,
  },
] as const;

/**
 * Marketing top-bar with terminal window chrome.
 * In the docs layout (step 9) this becomes sticky; for the marketing
 * variant it is non-sticky.
 *
 * Responsive: desktop-only nav links (agents, skills, commands, github, npm)
 * are hidden below the md: breakpoint. Only `docs` remains visible at mobile.
 * The `aidemd.dev — zsh` label also hides at the smallest sizes to save space.
 *
 * In the docs layout, `hamburgerSlot` is rendered inside the nav area at mobile
 * (block md:hidden) so the hamburger appears after the docs link.
 */
export default function TopBar({ active, sticky, hamburgerSlot }: TopBarProps) {
  return (
    <header
      className="flex items-center gap-[10px] px-[16px] py-[10px] bg-[color:var(--color-card)] border-b border-[color:var(--color-border)]"
      style={sticky ? { position: 'sticky', top: 0, zIndex: 10, height: 44 } : undefined}
      aria-label="Site header"
    >
      <TrafficLights />
      <span
        className="ml-[18px] text-[12px] text-[color:var(--color-dim)] hidden md:inline"
        aria-hidden="true"
      >
        aidemd.dev — zsh
      </span>
      <nav
        className="ml-auto flex items-center gap-[20px] text-[11px] text-[color:var(--color-dim)]"
        aria-label="Main navigation"
      >
        {NAV_LINKS.map(({ label, href, external, mobileVisible }) => {
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
    </header>
  );
}
