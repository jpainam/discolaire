import { atomWithStorage } from "jotai/utils";

export type SearchCriteria = {
  target: string;
  query: string;
  field: string;
};
export const peopleCriteriaAtom = atomWithStorage<SearchCriteria>(
  "peopleCriteria",
  {
    target: "all",
    field: "",
    query: "",
  },
);
