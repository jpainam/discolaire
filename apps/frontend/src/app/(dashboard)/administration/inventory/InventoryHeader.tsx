"use client";

import { BlocksIcon, StretchVerticalIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";

import { useModal } from "~/hooks/use-modal";
import { useSheet } from "~/hooks/use-sheet";
import { CreateEditAsset } from "./CreateEditAsset";
import { CreateEditConsumable } from "./CreateEditConsumable";

export function InventoryHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="ml-auto flex flex-row items-center gap-2">
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
          <BlocksIcon className="h-4 w-4" />
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
          <StretchVerticalIcon className="h-4 w-4" />
          {t("Create an asset")}
        </Button>
      </div>
    </div>
  );
}
