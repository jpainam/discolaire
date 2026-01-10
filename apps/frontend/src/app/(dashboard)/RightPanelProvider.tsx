"use client";

import type { PropsWithChildren, ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

interface RightPanelContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
}

const RightPanelContext = createContext<RightPanelContextValue | null>(null);

export function RightPanelProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(true);
  const [content, setContent] = useState<ReactNode | null>(null);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      toggle: () => setIsOpen((prev) => !prev),
      content,
      setContent,
    }),
    [content, isOpen],
  );

  return (
    <RightPanelContext.Provider value={value}>
      {children}
    </RightPanelContext.Provider>
  );
}

export function useRightPanel() {
  const context = useContext(RightPanelContext);
  if (!context) {
    throw new Error("useRightPanel must be used within RightPanelProvider");
  }
  return context;
}
