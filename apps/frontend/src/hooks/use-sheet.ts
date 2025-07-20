"use client";

import type React from "react";
import { useCallback } from "react";
import { atom, useAtomValue, useSetAtom } from "jotai";

export type SheetPlacements = "left" | "right" | "top" | "bottom";

interface SheetTypes {
  view: React.ReactNode;
  isOpen: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  placement?: SheetPlacements;
  className?: string;
}

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

  const openSheet = useCallback(
    ({
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const closeSheet = useCallback(() => {
    setState({
      ...state,
      isOpen: false,
      title: null,
      description: null,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    ...state,
    openSheet,
    closeSheet,
  };
}
