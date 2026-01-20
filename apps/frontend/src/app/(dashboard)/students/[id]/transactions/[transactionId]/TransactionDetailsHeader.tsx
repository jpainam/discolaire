"use client";

import { useParams } from "next/navigation";
import { EuroIcon, Printer } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useCheckPermission } from "~/hooks/use-permission";

export function TransactionDetailsHeader() {
  const params = useParams<{ transactionId: string }>();

  const t = useTranslations();
  const canCreateTransaction = useCheckPermission("transaction.create");

  return (
    <div className="bg-secondary text-secondary-foreground flex flex-row items-center gap-2 border-b px-4 py-1">
      <EuroIcon className="h-5 w-5" />
      <Label>{t("receipt")}</Label>
      <div className="ml-auto">
        {canCreateTransaction && (
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
        )}
      </div>
    </div>
  );
}
