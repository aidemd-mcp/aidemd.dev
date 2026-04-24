'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface DocsDrawerContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const DocsDrawerContext = createContext<DocsDrawerContextValue>({
  isOpen: false,
  open: () => {},
  close: () => {},
});

/**
 * Provides sidebar-drawer open/close state to the docs shell.
 * Wraps the entire docs layout so both the hamburger button (in TopBar)
 * and the drawer overlay (next to DocsSidebar) can share state without
 * prop-drilling through the server layout component.
 */
export function DocsDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <DocsDrawerContext.Provider value={{ isOpen, open, close }}>
      {children}
    </DocsDrawerContext.Provider>
  );
}

export function useDocsDrawer(): DocsDrawerContextValue {
  return useContext(DocsDrawerContext);
}
