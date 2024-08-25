"use client";

import { atom, useAtomValue, useSetAtom } from "jotai";
import React from "react";

type ModalTypes = {
  view: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  isOpen: boolean;
  className?: string;
};

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

  const openModal = ({
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
  };

  const closeModal = () => {
    setState({
      ...state,
      isOpen: false,
    });
  };

  return {
    ...state,
    openModal,
    closeModal,
  };
}
