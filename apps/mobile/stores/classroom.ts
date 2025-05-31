// stores/useSearchStore.ts
import { create } from "zustand";

interface FilterStore {
  query: string;
  setQuery: (query: string) => void;
  //
  cycle: string;
  setCycle: (cycle: string) => void;
  //
  section: string;
  setSection: (section: string) => void;
}

export const useClassroomFilterStore = create<FilterStore>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
  cycle: "",
  setCycle: (cycle) => set({ cycle }),
  section: "",
  setSection: (section) => set({ section }),
}));
