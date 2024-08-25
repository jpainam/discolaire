"use client";

import { atom, useAtomValue, useSetAtom } from "jotai";
import React from "react";

export type SheetPlacements = "left" | "right" | "top" | "bottom";

type SheetTypes = {
  view: React.ReactNode;
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  placement?: SheetPlacements;
  className?: string;
};

const sheetAtom = atom<SheetTypes>({
  isOpen: false,
  view: null,
  title: null,
  description: null,
  placement: "right",
  className: "w-[700px]",
});

export function useSheet() {
  const state = useAtomValue(sheetAtom);
  const setState = useSetAtom(sheetAtom);

  const openSheet = ({
    view,
    placement,
    className,
    title,
    description,
  }: {
    view: React.ReactNode;
    placement?: SheetPlacements;
    className?: string;
    description?: React.ReactNode;
    title?: React.ReactNode;
  }) => {
    setState({
      ...state,
      isOpen: true,
      view,
      title,
      description,
      placement,
      className,
    });
  };

  const closeSheet = () => {
    setState({
      ...state,
      isOpen: false,
      title: null,
      description: null,
    });
  };

  return {
    ...state,
    openSheet,
    closeSheet,
  };
}
