'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { SectionId } from '@/types/expo';
import { useExpoTip } from '@/components/Expo/ExpoTipContext';

interface SectionObserverProps {
  id: SectionId;
  children: ReactNode;
}

// ---------------------------------------------------------------------------
// Module-scope scroll tracker
//
// Behavioral invariant: the tip changes to match whichever section the visitor
// is currently reading. A section becomes "active" when it is the
// most-recently-entered section, determined by scroll direction:
//
//   Scrolling DOWN → among sections whose top edge is within the upper 80% of
//     the viewport ([0, vh*0.8]), pick the one with the LARGEST viewport-top.
//     This is the section that most recently entered from below.
//
//   Scrolling UP → among sections whose top edge is anywhere in the viewport
//     ([0, vh]), pick the one with the SMALLEST viewport-top.
//     This is the section that most recently entered from above.
//
//   Fallback (all sections above viewport) → the section most recently
//     scrolled above y=0 (largest negative top, closest to zero from above).
//
// Why a module-scope registry instead of per-element IntersectionObserver:
//   IntersectionObserver with any single rootMargin cannot simultaneously
//   handle the hero section (top=44px, active at scroll=0 while threeLayerModel
//   top=564px is also in view) and the quickstart section (top=3695px absolute,
//   geometrically unreachable by any narrow IO band given maxScroll=2746px and
//   viewport=1273px). A shared scroll listener that reads all positions on each
//   tick and applies direction-aware selection handles all cases correctly
//   without per-id special casing.
//
// At page load (scroll=0), setActiveSection is never called — the ExpoTipContext
// default ('hero') stands. The scroll listener fires only on actual user scroll.
// ---------------------------------------------------------------------------

type RegistryEntry = {
  el: HTMLElement;
  id: SectionId;
  set: (id: SectionId) => void;
};

const registry: RegistryEntry[] = [];
let scrollListenerAttached = false;
let prevScrollY = 0;

function tick(): void {
  const currentScrollY = window.scrollY;
  const vh = window.innerHeight;

  // Positive delta = scrolling down; negative = scrolling up.
  const delta = currentScrollY - prevScrollY;
  prevScrollY = currentScrollY;

  const scrollingDown = delta >= 0;

  // Upper bound for eligible sections. When scrolling down we only consider
  // sections whose top is within the upper 80% of the viewport — this prevents
  // sections near the very bottom of a tall viewport from firing too early,
  // while still making the last section (quickstart top≈949px at maxScroll on
  // a 1273px viewport) reachable (80% of 1273 = 1018px > 949px).
  // When scrolling up we allow the full viewport so the topmost section wins.
  const upperLimit = scrollingDown ? vh * 0.8 : vh;

  const eligible: Array<{ entry: RegistryEntry; top: number }> = [];
  for (const entry of registry) {
    const top = entry.el.getBoundingClientRect().top;
    if (top >= 0 && top <= upperLimit) {
      eligible.push({ entry, top });
    }
  }

  let winner: RegistryEntry | null = null;

  if (eligible.length > 0) {
    if (scrollingDown) {
      // Most recently entered from below = largest top within the upper limit.
      let best = -1;
      for (const { entry, top } of eligible) {
        if (top > best) {
          best = top;
          winner = entry;
        }
      }
    } else {
      // Most recently entered from above = smallest top anywhere in viewport.
      let best = Infinity;
      for (const { entry, top } of eligible) {
        if (top < best) {
          best = top;
          winner = entry;
        }
      }
    }
  } else {
    // All section tops are above the viewport (all negative tops). Pick the
    // section most recently scrolled above y=0 (largest negative top).
    let closestNegTop = -Infinity;
    for (const entry of registry) {
      const top = entry.el.getBoundingClientRect().top;
      if (top < 0 && top > closestNegTop) {
        closestNegTop = top;
        winner = entry;
      }
    }
  }

  if (winner !== null) {
    winner.set(winner.id);
  }
}

function attachScrollListener(): void {
  if (scrollListenerAttached) return;
  scrollListenerAttached = true;
  prevScrollY = window.scrollY;
  window.addEventListener('scroll', tick, { passive: true });
}

function detachScrollListenerIfEmpty(): void {
  if (registry.length === 0 && scrollListenerAttached) {
    window.removeEventListener('scroll', tick);
    scrollListenerAttached = false;
  }
}

/**
 * Wraps a marketing section's root element. Registers the element in a
 * module-scope registry and fires setActiveSection via a shared window scroll
 * listener. On unmount, unregisters and removes the listener if no sections
 * remain. The hero tip is preserved at scroll=0 via the ExpoTipContext default
 * ('hero') — setActiveSection is not called until the first scroll event.
 */
export default function SectionObserver({ id, children }: SectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useExpoTip();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const entry: RegistryEntry = { el, id, set: setActiveSection };
    registry.push(entry);
    attachScrollListener();

    return () => {
      const idx = registry.indexOf(entry);
      if (idx !== -1) registry.splice(idx, 1);
      detachScrollListenerIfEmpty();
    };
  }, [id, setActiveSection]);

  return <div ref={ref}>{children}</div>;
}
