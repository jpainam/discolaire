// src/stores/breadcrumbs.store.ts
import { create } from "zustand";

import type { BreadcrumbIconKey } from "~/icons";

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: BreadcrumbIconKey;
}

interface BreadcrumbState {
  items: BreadcrumbItem[];
  setItems: (items: BreadcrumbItem[]) => void;
  reset: () => void;
}

const HOME: BreadcrumbItem[] = [{ label: "Home", href: "/", icon: "home" }];

export const useBreadcrumbsStore = create<BreadcrumbState>((set) => ({
  items: HOME,
  setItems: (items) => set({ items }),
  reset: () => set({ items: HOME }),
}));
