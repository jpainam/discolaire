import { addDays, subDays } from "date-fns";
import { atom } from "jotai";

type TransactionToolbarSearchParams = {
  from: Date;
  to: Date;
  status: string;
};

export const transactionSearchAtom = atom<TransactionToolbarSearchParams>({
  from: subDays(new Date(), 15),
  to: addDays(new Date(), 15),
  status: "all",
} as TransactionToolbarSearchParams);

export const selectedStudentIdsAtom = atom<string[]>([]);
