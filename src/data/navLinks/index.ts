/**
 * The single nav roster every page's TopBar renders, in display order:
 * docs, brain, observer, github ↗, npm ↗. `mobileVisible: false` entries hide
 * below the `md:` breakpoint; docs, brain and observer stay visible at every viewport.
 */
const navLinks = [
  { label: "docs", href: "/docs", external: false, mobileVisible: true },
  { label: "brain", href: "/brain", external: false, mobileVisible: true },
  { label: "observer", href: "/observer", external: false, mobileVisible: true },
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

export default navLinks;
