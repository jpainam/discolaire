"use client";

import type { RouterOutputs } from "@repo/api";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";

interface CreateTransactionContextProps {
  description: string | null;
  setDescription: (description: string) => void;
  amount: number | null;
  setAmount: (amount: number) => void;
  transactionType: string | null;
  setTransactionType: (transactionType: string) => void;
  paymentMethod: string | null;
  setPaymentMethod: (paymentMethod: string) => void;
  classroom: NonNullable<RouterOutputs["student"]["classroom"]>;
  fees: RouterOutputs["classroom"]["fees"];
  studentContacts: RouterOutputs["student"]["contacts"];
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
      "useCreateTransaction must be used within a <SchoolContextProvider />"
    );
  }
  return context;
}

export const CreateTransactionContextProvider = ({
  children,
  fees,
  studentContacts,
  classroom,
  unpaidRequiredFees,
}: PropsWithChildren<{
  fees: RouterOutputs["classroom"]["fees"];
  classroom: NonNullable<RouterOutputs["student"]["classroom"]>;
  studentContacts: RouterOutputs["student"]["contacts"];
  unpaidRequiredFees: RouterOutputs["student"]["unpaidRequiredFees"];
}>) => {
  const [description, setDescription] = useState<string | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [requiredFeeIds, setRequiredFeeIds] = useState<number[]>([]);
  return (
    <CreateTransactionContext.Provider
      value={{
        fees,
        studentContacts,
        classroom,
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
