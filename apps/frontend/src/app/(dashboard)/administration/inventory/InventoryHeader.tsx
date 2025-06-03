"use client";

import { Button } from "@repo/ui/components/button";
import { BlocksIcon, StretchVerticalIcon } from "lucide-react";
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
    <div className="flex flex-row items-center gap-2">
      <div className="ml-auto flex flex-row gap-2 items-center">
        <Button
          onClick={() => {
            openSheet({
              title: t("Create a consumable"),
              view: <CreateEditConsumable />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <BlocksIcon className="w-4 h-4" />
          {t("Create a consumable")}
        </Button>
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
          <StretchVerticalIcon className="w-4 h-4" />
          {t("Create an asset")}
        </Button>
      </div>
    </div>
  );
}
