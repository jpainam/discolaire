"use client";

import { Button } from "@repo/ui/components/button";
import {
  BlocksIcon,
  MinusIcon,
  PlusIcon,
  StretchVerticalIcon,
} from "lucide-react";
import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";
import { CreateEditAsset } from "./CreateEditAsset";
import { CreateEditConsumable } from "./CreateEditConsumable";
import { CreateEditMovement } from "./CreateEditMovement";
export function InventoryHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row items-center gap-2">
      {/* <LayoutListIcon className="w-4 h-4" />
      <Label>{t("inventory")}</Label> */}
      <div className="ml-auto flex flex-row gap-2 items-center">
        <Button
          onClick={() => {
            openSheet({
              title: t("Create a stock movement"),
              description: t("OUT"),
              view: <CreateEditMovement type={"OUT"} />,
            });
          }}
          size={"sm"}
        >
          <MinusIcon className="w-4 h-4" />
          {t("Stock withdrawal")}
        </Button>
        <Button
          onClick={() => {
            openSheet({
              title: t("Create a stock movement"),
              description: t("IN"),
              view: <CreateEditMovement type={"IN"} />,
            });
          }}
          size={"sm"}
        >
          <PlusIcon className="w-4 h-4" />
          {t("Stock addition")}
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
          <BlocksIcon className="w-4 h-4" />
          {t("Create a consumable")}
        </Button>
      </div>
    </div>
  );
}
