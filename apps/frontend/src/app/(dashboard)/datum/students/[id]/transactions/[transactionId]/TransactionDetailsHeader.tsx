"use client";

import { Printer } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

export function TransactionDetailsHeader() {
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center gap-2 border-b bg-secondary px-4 py-1 text-secondary-foreground">
      <Label>{t("receipt")}</Label>
      <div className="ml-auto">
        <Button variant={"outline"} size={"sm"}>
          <Printer className="mr-2 h-4 w-4" />
          {t("print")}
        </Button>
      </div>
    </div>
  );
}
