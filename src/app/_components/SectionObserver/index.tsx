'use client';

import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import type { SectionId } from '@/types/expo';
import { useExpoTip } from '@/components/Expo/ExpoTipContext';

interface SectionObserverProps {
  id: SectionId;
  children: ReactNode;
}

/**
 * Wraps a marketing section's root element. Uses IntersectionObserver to call
 * setActiveSection when the section enters the viewport threshold. On exit or
 * unmount, no-op — the next entering observer takes over.
 */
export default function SectionObserver({ id, children }: SectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { setActiveSection } = useExpoTip();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection(id);
        }
      },
      { rootMargin: '-30% 0px -30% 0px', threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [id, setActiveSection]);

  return <div ref={ref}>{children}</div>;
}
