'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { SectionId } from '@/types/expo';

const SESSION_KEY = 'expo-dismissed';

function readSessionDismissed(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSessionDismissed(value: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (value) {
      sessionStorage.setItem(SESSION_KEY, '1');
    } else {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {
    // sessionStorage unavailable (private browsing, quota exceeded) — fall back to in-memory state
  }
}

interface ExpoTipContextValue {
  activeSection: SectionId;
  setActiveSection: (id: SectionId) => void;
  dismissed: boolean;
  setDismissed: (v: boolean) => void;
}

const ExpoTipContext = createContext<ExpoTipContextValue | null>(null);

/** Provides scroll-contextual Expo mascot state to the full page tree. */
export function ExpoTipProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>('hero');
  const [dismissed, setDismissed] = useState<boolean>(false);

  useEffect(() => {
    if (readSessionDismissed()) setDismissed(true);
  }, []);

  function handleSetDismissed(value: boolean) {
    writeSessionDismissed(value);
    setDismissed(value);
  }

  return (
    <ExpoTipContext.Provider
      value={{ activeSection, setActiveSection, dismissed, setDismissed: handleSetDismissed }}
    >
      {children}
    </ExpoTipContext.Provider>
  );
}

/** Reads Expo mascot state. Must be called inside ExpoTipProvider. */
export function useExpoTip(): ExpoTipContextValue {
  const ctx = useContext(ExpoTipContext);
  if (!ctx) throw new Error('useExpoTip must be used inside ExpoTipProvider');
  return ctx;
}
