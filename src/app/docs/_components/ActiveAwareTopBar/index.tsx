'use client';

import { usePathname } from 'next/navigation';
import TopBar from '@/app/_components/TopBar';
import HamburgerButton from '../HamburgerButton';

type ActivePage = 'docs' | 'brain';

/**
 * Minimal client wrapper around TopBar that reads usePathname() and derives the
 * active nav entry via prefix-matching. Keeps TopBar itself a server component.
 *
 * Mapping:
 *   /brain*  → 'brain'
 *   /docs/*  → 'docs'  (agents, skills, commands are docs subnav — they all light 'docs')
 *
 * HamburgerButton is passed as `hamburgerSlot` to TopBar — rendered inside
 * the nav flex row, only visible below the md: breakpoint. This avoids
 * absolute-positioning overlaps with the nav links at mobile.
 */
export default function ActiveAwareTopBar() {
  const pathname = usePathname();

  let active: ActivePage = 'docs';
  if (pathname.startsWith('/brain')) {
    active = 'brain';
  }
  // All /docs/* paths (including agents, skills, commands subnav) map to 'docs' (the default)

  return <TopBar active={active} sticky hamburgerSlot={<HamburgerButton />} />;
}
