"use client";

import { useCreateTransaction } from "./CreateTransactionContextProvider";
import { Step1 } from "./step1";
import { Step2 } from "./step2";

export function CreateTransaction() {
  const { amount, paymentMethod, transactionType, description } =
    useCreateTransaction();
  const isStep2 = amount && description && transactionType && paymentMethod;
  return <>{isStep2 ? <Step2 /> : <Step1 />}</>;
}
