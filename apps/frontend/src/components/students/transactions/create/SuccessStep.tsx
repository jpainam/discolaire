"use client";
import { makePaymentAtom } from "@/atoms/payment";
import { routes } from "@/configs/routes";
import { useRouter } from "@/hooks/use-router";
import { api } from "@/trpc/react";
import { useAtom } from "jotai";
import { Loader } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function SuccessStep() {
  const params = useParams() as { id: string };
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
            return error.message;
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
              routes.students.transactions.details(params.id, result?.id)
            );
            return "Transaction created successfully";
          },
        }
      );
    }
  }, [payment, params.id]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="h-40 flex items-center justify-center my-2 border bg-secondary text-primary rounded-md">
      <Loader className="text-xl animate-spin" />
    </div>
  );
}
