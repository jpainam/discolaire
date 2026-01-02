"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export type SheetPlacements = "left" | "right" | "top" | "bottom";

interface SheetTypes {
  view: React.ReactNode;
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  formId?: string;
  cancelText?: React.ReactNode;
  submitText?: React.ReactNode;
  submitDisabled?: boolean;
  submitLoading?: boolean;
  placement?: SheetPlacements;
  className?: string;
}

interface SheetOpenOptions {
  view: React.ReactNode;
  placement?: SheetPlacements;
  className?: string;
  description?: React.ReactNode;
  title?: React.ReactNode;
  footer?: React.ReactNode;
  formId?: string;
  cancelText?: React.ReactNode;
  submitText?: React.ReactNode;
}

type SheetContextValue = SheetTypes & {
  openSheet: (options: SheetOpenOptions) => void;
  closeSheet: () => void;
  setFooter: (footer: React.ReactNode) => void;
  clearFooter: () => void;
};

const defaultState: SheetTypes = {
  isOpen: false,
  view: null,
  title: null,
  description: null,
  footer: null,
  formId: undefined,
  cancelText: undefined,
  submitText: undefined,
  placement: "right",
  className: "w-[700px]",
};

const SheetContext = createContext<SheetContextValue | null>(null);

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SheetTypes>(defaultState);

  const openSheet = useCallback((options: SheetOpenOptions) => {
    setState({
      ...defaultState,
      isOpen: true,
      view: options.view,
      title: options.title,
      description: options.description,
      footer: options.footer,
      formId: options.formId,
      cancelText: options.cancelText,
      submitText: options.submitText,
      placement: options.placement ?? defaultState.placement,
      className: options.className ?? defaultState.className,
    });
  }, []);

  const closeSheet = useCallback(() => {
    setState(defaultState);
  }, []);

  const setFooter = useCallback((footer: React.ReactNode) => {
    setState((prev) => ({
      ...prev,
      footer,
    }));
  }, []);

  const clearFooter = useCallback(() => {
    setState((prev) => ({
      ...prev,
      footer: null,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      openSheet,
      closeSheet,
      setFooter,
      clearFooter,
    }),
    [state, openSheet, closeSheet, setFooter, clearFooter],
  );

  return (
    <SheetContext.Provider value={value}>{children}</SheetContext.Provider>
  );
}

export function useSheet() {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error("useSheet must be used within a <SheetProvider />");
  }
  return context;
}
