"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { VisibilityState } from "@tanstack/react-table";

interface DataTableSettingsState {
  columnVisibilityByKey: Record<string, VisibilityState>;
  setColumnVisibility: (key: string, visibility: VisibilityState) => void;
}

export const useDataTableSettings = create(
  persist<DataTableSettingsState>(
    (set) => ({
      columnVisibilityByKey: {},
      setColumnVisibility: (key, visibility) =>
        set((state) => ({
          columnVisibilityByKey: {
            ...state.columnVisibilityByKey,
            [key]: visibility,
          },
        })),
    }),
    {
      name: "data-table-settings",
    },
  ),
);
