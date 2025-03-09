"use client";

import { EuroIcon, Printer } from "lucide-react";
import { useParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { useLocale } from "~/i18n";

export function TransactionDetailsHeader() {
  const params = useParams<{ transactionId: string }>();
  const { t } = useLocale();

  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-4 py-1 text-secondary-foreground">
      <EuroIcon className="h-5 w-5" />
      <Label>{t("receipt")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            window.open(
              `/api/pdf/receipts?id=${params.transactionId}`,
              "_blank",
            );
          }}
          variant={"outline"}
          size={"sm"}
        >
          <Printer />
          {t("print")}
        </Button>
      </div>
    </div>
  );
}
