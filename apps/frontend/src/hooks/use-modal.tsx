"use client";

import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface ModalTypes {
  view: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

interface ModalOpenOptions {
  view: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}

type ModalContextValue = ModalTypes & {
  openModal: (options: ModalOpenOptions) => void;
  closeModal: () => void;
};

const defaultState: ModalTypes = {
  isOpen: false,
  view: null,
  title: null,
  className: "",
  description: null,
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ModalTypes>(defaultState);

  const openModal = useCallback((options: ModalOpenOptions) => {
    setState({
      ...defaultState,
      isOpen: true,
      view: options.view,
      title: options.title,
      description: options.description,
      className: options.className ?? defaultState.className,
    });
  }, []);

  const closeModal = useCallback(() => {
    setState(defaultState);
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      openModal,
      closeModal,
    }),
    [state, openModal, closeModal],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a <ModalProvider />");
  }
  return context;
}
