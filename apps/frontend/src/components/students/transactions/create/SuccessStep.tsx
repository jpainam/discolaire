"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useAtom } from "jotai";
import { Loader } from "lucide-react";
import { toast } from "sonner";

import { useRouter } from "@repo/hooks/use-router";

import { makePaymentAtom } from "~/atoms/payment";
import { routes } from "~/configs/routes";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function SuccessStep() {
  const params = useParams<{ id: string }>();
  const [payment, setPayment] = useAtom(makePaymentAtom);
  const router = useRouter();
  const createTransactionMutation = api.transaction.create.useMutation();

  useEffect(() => {
    if (payment.amount && payment.description && payment.transactionType) {
      toast.promise(
        createTransactionMutation.mutateAsync({
          //paymentMethod: payment.paymentMethod,
          description: payment.description,
          studentId: params.id,
          transactionType: payment.transactionType,
          amount: Number(payment.amount),

          //paymentReceived: payment.paymentReceived,
          //paymentCorrectness: payment.paymentCorrectness,
          //notifications: payment.notifications,
        }),
        {
          loading: "Creating transaction...",
          error: (error) => {
            return getErrorMessage(error);
          },
          success: (result) => {
            setPayment((prev) => ({
              ...prev,
              amount: "",
              description: "",
              transactionType: "",
              paymentMethod: "",
            }));

            router.push(
              routes.students.transactions.details(params.id, result.id),
            );
            return "Transaction created successfully";
          },
        },
      );
    }
  }, [payment, params.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="my-2 flex h-40 items-center justify-center rounded-md border bg-secondary text-primary">
      <Loader className="animate-spin text-xl" />
    </div>
  );
}
