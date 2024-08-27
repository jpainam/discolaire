import { atomWithStorage } from "jotai/utils";

export interface SearchCriteria {
  target: string;
  query: string;
  field: string;
}
export const peopleCriteriaAtom = atomWithStorage<SearchCriteria>(
  "peopleCriteria",
  {
    target: "all",
    field: "",
    query: "",
  },
);
