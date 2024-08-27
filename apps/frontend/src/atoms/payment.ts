import { atom } from "jotai";

interface MakePayment {
  paymentMethod: string;
  transactionRef: string;
  description: string;
  transactionType: string;
  amount: number | string;
  paymentReceived: boolean;
  paymentCorrectness: boolean;
  notifications: {
    emails: string[];
    sms: string[];
  };
}

export const makePaymentAtom = atom<MakePayment>({
  paymentMethod: "",
  description: "",
  transactionRef: "",
  transactionType: "",
  amount: "",
  paymentReceived: false,
  paymentCorrectness: false,
  notifications: {
    emails: [],
    sms: [],
  },
} as MakePayment);
