import { create } from "zustand";

interface RightPanelState {
  showMeta: boolean;
  setShowMeta: (show: boolean) => void;
  toggleMeta: () => void;
}

export const useRightPanelStore = create<RightPanelState>((set) => ({
  showMeta: true,
  setShowMeta: (show) => set({ showMeta: show }),
  toggleMeta: () => set((state) => ({ showMeta: !state.showMeta })),
}));
