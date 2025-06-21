// stores/useSearchStore.ts
import { create } from "zustand";

interface FilterStore {
  query: string;
  setQuery: (query: string) => void;
}

export const useStudentFilterStore = create<FilterStore>((set) => ({
  query: "",
  setQuery: (query) => set({ query }),
}));
