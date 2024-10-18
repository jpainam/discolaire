"use client";

import { useParams } from "next/navigation";
import { EuroIcon, Printer } from "lucide-react";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { printReceipt } from "~/actions/reporting";
import { getErrorMessage } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function TransactionDetailsHeader() {
  const params = useParams<{ transactionId: string }>();
  const { t } = useLocale();
  const utils = api.useUtils();

  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-4 py-1 text-secondary-foreground">
      <EuroIcon className="h-5 w-5" />
      <Label>{t("receipt")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            toast.loading(t("printing"), { id: 0 });
            void printReceipt(Number(params.transactionId))
              .then(() => {
                void utils.reporting.invalidate();
                toast.success(t("printing_job_submitted"), { id: 0 });
              })
              .catch((e) => {
                toast.error(getErrorMessage(e), { id: 0 });
              });
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
