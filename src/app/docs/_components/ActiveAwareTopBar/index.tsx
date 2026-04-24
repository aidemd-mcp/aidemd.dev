'use client';

import { usePathname } from 'next/navigation';
import TopBar from '@/app/_components/TopBar';
import HamburgerButton from '../HamburgerButton';

type ActivePage = 'docs' | 'agents' | 'skills' | 'commands';

/**
 * Minimal client wrapper around TopBar that reads usePathname() and derives the
 * active nav entry via prefix-matching. Keeps TopBar itself a server component.
 *
 * Mapping (load-bearing — must match plan spec exactly):
 *   /docs/agents/*       → 'agents'
 *   /docs/skills/*       → 'skills'
 *   /docs/commands/*     → 'commands'
 *   /docs/methodology/*  → 'docs'  (methodology maps to the 'docs' nav label)
 *   /docs/ (exact)       → 'docs'
 *
 * HamburgerButton is passed as `hamburgerSlot` to TopBar — rendered inside
 * the nav flex row, only visible below the md: breakpoint. This avoids
 * absolute-positioning overlaps with the nav links at mobile.
 */
export default function ActiveAwareTopBar() {
  const pathname = usePathname();

  let active: ActivePage = 'docs';
  if (pathname.startsWith('/docs/agents/')) {
    active = 'agents';
  } else if (pathname.startsWith('/docs/skills/')) {
    active = 'skills';
  } else if (pathname.startsWith('/docs/commands/')) {
    active = 'commands';
  }
  // /docs/methodology/* and /docs/ both map to 'docs' (the default)

  return <TopBar active={active} sticky hamburgerSlot={<HamburgerButton />} />;
}
