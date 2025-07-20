"use client";

import { useParams } from "next/navigation";
import { EuroIcon, Printer } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { useLocale } from "~/i18n";

export function TransactionDetailsHeader() {
  const params = useParams<{ transactionId: string }>();
  const { t } = useLocale();

  return (
    <div className="bg-secondary text-secondary-foreground flex flex-row items-center gap-2 border-b px-4 py-1">
      <EuroIcon className="h-5 w-5" />
      <Label>{t("receipt")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            window.open(
              `/api/pdfs/receipts?id=${params.transactionId}`,
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
