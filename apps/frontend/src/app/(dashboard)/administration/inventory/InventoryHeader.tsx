"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { LayoutListIcon, PlusIcon } from "lucide-react";
import { useLocale } from "~/i18n";

export function InventoryHeader() {
  const { t } = useLocale();
  return (
    <div className="flex flex-row items-center gap-2 px-4">
      <LayoutListIcon className="w-4 h-4" />
      <Label>{t("inventory")}</Label>
      <div className="ml-auto flex flex-row gap-2 items-center">
        <Button size={"sm"} variant={"outline"}>
          <PlusIcon className="w-4 h-4" />
          {t(" category")}
        </Button>
        <Button size={"sm"}>
          <PlusIcon className="w-4 h-4" />
          {t("stock movement")}
        </Button>
      </div>
    </div>
  );
}
