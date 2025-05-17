"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { LayoutListIcon, PlusIcon } from "lucide-react";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { CreateEditAsset } from "./CreateEditAsset";
import { CreateEditConsumable } from "./CreateEditConsumable";

export function InventoryHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row items-center gap-2 px-4">
      <LayoutListIcon className="w-4 h-4" />
      <Label>{t("inventory")}</Label>
      <div className="ml-auto flex flex-row gap-2 items-center">
        <Button size={"sm"}>{t("Stock movement")}</Button>
        <Button
          onClick={() => {
            openModal({
              title: t("Create an asset"),
              view: <CreateEditAsset />,
            });
          }}
          variant={"outline"}
          size={"sm"}
        >
          <PlusIcon className="w-4 h-4" />
          {t("Create an asset")}
        </Button>
        <Button
          onClick={() => {
            openSheet({
              title: t("Create a consumable"),
              view: <CreateEditConsumable />,
            });
          }}
          variant={"outline"}
          size={"sm"}
        >
          {t("Create a consumable")}
        </Button>
      </div>
    </div>
  );
}
