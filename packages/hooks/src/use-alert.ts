"use client";

import type React from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";

interface AlertTypes {
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}

const alertAtom = atom<AlertTypes>({
  isOpen: false,
  title: null,
  description: null,
  onCancel: undefined,
  onConfirm: undefined,
});

export function useAlert() {
  const state = useAtomValue(alertAtom);
  const setState = useSetAtom(alertAtom);

  const openAlert = ({
    title,
    description,
    onCancel,
    onConfirm,
  }: {
    title: React.ReactNode;
    description?: React.ReactNode;
    onCancel?: () => void;
    onConfirm?: () => void;
  }) => {
    setState({
      ...state,
      isOpen: true,
      title,
      description,
      onCancel,
      onConfirm,
    });
  };

  const closeAlert = () => {
    setState({
      ...state,
      isOpen: false,
      title: null,
      description: null,
      onCancel: undefined,
      onConfirm: undefined,
    });
  };

  return {
    ...state,
    openAlert,
    closeAlert,
  };
}
