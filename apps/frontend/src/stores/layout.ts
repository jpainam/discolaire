import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StudentLayoutSettingsState {
  layoutMode: LayoutMode;
  sidebarOpen: boolean;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeRightPanel: string | null;
  setActiveRightPanel: (panelId: string | null) => void;
}

export const useStudentLayout = create(
  persist<StudentLayoutSettingsState>(
    (set) => ({
      layoutMode: "grid",
      sidebarOpen: true,
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      activeRightPanel: null,
      setActiveRightPanel: (panelId) => set({ activeRightPanel: panelId }),
    }),
    {
      name: "student-layout-settings", // Key in localStorage
    },
  ),
);

type LayoutMode = "grid" | "list";

interface LayoutSettingsState {
  layoutMode: LayoutMode;
  sidebarOpen: boolean;
  setLayoutMode: (mode: LayoutMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useLayoutSettings = create(
  persist<LayoutSettingsState>(
    (set) => ({
      layoutMode: "grid",
      sidebarOpen: true,
      setLayoutMode: (mode) => set({ layoutMode: mode }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
    }),
    {
      name: "layout-settings", // Key in localStorage
    },
  ),
);
