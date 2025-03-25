"use client";

import type { RouterOutputs } from "@repo/api";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

interface CreateTransactionContextProps {
  description: string | null;
  setDescription: (description: string) => void;
  amount: number | null;
  transactions: RouterOutputs["student"]["transactions"];
  setAmount: (amount: number) => void;
  transactionType: string | null;
  student: RouterOutputs["student"]["get"];
  setTransactionType: (transactionType: string) => void;
  paymentMethod: string | null;
  setPaymentMethod: (paymentMethod: string) => void;
  classroom: NonNullable<RouterOutputs["student"]["classroom"]>;
  fees: RouterOutputs["classroom"]["fees"];
  studentContacts: RouterOutputs["student"]["contacts"];
  notifications: string[];
  setNotifications: (notifications: string[]) => void;
  requiredFeeIds: number[];
  setRequiredFeeIds: (feeIds: number[]) => void;
  unpaidRequiredFees: RouterOutputs["student"]["unpaidRequiredFees"];
}

export const CreateTransactionContext = createContext<
  CreateTransactionContextProps | undefined
>(undefined);

export function useCreateTransaction() {
  const context = useContext(CreateTransactionContext);
  if (!context) {
    throw new Error(
      "useCreateTransaction must be used within a <CreateTransactionContextProvider />",
    );
  }
  return context;
}

export const CreateTransactionContextProvider = ({
  children,
  fees,
  studentContacts,
  transactions,
  classroom,
  unpaidRequiredFees,
  student,
}: PropsWithChildren<{
  fees: RouterOutputs["classroom"]["fees"];
  transactions: RouterOutputs["student"]["transactions"];
  classroom: NonNullable<RouterOutputs["student"]["classroom"]>;
  studentContacts: RouterOutputs["student"]["contacts"];
  student: RouterOutputs["student"]["get"];
  unpaidRequiredFees: RouterOutputs["student"]["unpaidRequiredFees"];
}>) => {
  const [description, setDescription] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [requiredFeeIds, setRequiredFeeIds] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  return (
    <CreateTransactionContext.Provider
      value={{
        fees,
        studentContacts,
        classroom,
        student,
        notifications,
        setNotifications,
        transactions,
        description,
        setDescription,
        amount,
        setAmount,
        transactionType,
        setTransactionType,
        paymentMethod,
        setPaymentMethod,
        requiredFeeIds,
        unpaidRequiredFees,
        setRequiredFeeIds,
      }}
    >
      {children}
    </CreateTransactionContext.Provider>
  );
};
