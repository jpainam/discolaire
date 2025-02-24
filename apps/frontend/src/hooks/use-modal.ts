"use client";

import { atom, useAtomValue, useSetAtom } from "jotai";
import type React from "react";
import { useCallback } from "react";

interface ModalTypes {
  view: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  isOpen: boolean;
  className?: string;
}

const modalAtom = atom<ModalTypes>({
  isOpen: false,
  view: null,
  title: null,
  className: "",
  description: null,
});

export function useModal() {
  const state = useAtomValue(modalAtom);
  const setState = useSetAtom(modalAtom);

  const openModal = useCallback(
    ({
      view,
      title,
      description,
      className,
    }: {
      view: React.ReactNode;
      title?: React.ReactNode;
      description?: React.ReactNode;
      className?: string;
    }) => {
      setState({
        ...state,
        isOpen: true,
        view,
        title,
        description,
        className,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const closeModal = useCallback(() => {
    setState({
      ...state,
      isOpen: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    openModal,
    closeModal,
  };
}
