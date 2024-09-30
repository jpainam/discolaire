"use client";

import { useParams } from "next/navigation";
import { Printer } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { api } from "~/trpc/react";

export function TransactionDetailsHeader() {
  const params = useParams<{ transactionId: string }>();
  const { t } = useLocale();
  const printTransactionMutation = api.transaction.printReceipt.useMutation({
    onSuccess: () => {
      toast.success(t("printJobSubmitted"), { id: 0 });
    },
    onError: (error) => {
      toast.error(error.message, { id: 0 });
    },
    onSettled: () => {
      console.log("settled");
    },
  });
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-4 py-1 text-secondary-foreground">
      <Label>{t("receipt")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            toast.loading(t("printing"), { id: 0 });
            printTransactionMutation.mutate(Number(params.transactionId));
          }}
          variant={"outline"}
          size={"sm"}
        >
          <Printer className="mr-2 h-4 w-4" />
          {t("print")}
        </Button>
      </div>
    </div>
  );
}
