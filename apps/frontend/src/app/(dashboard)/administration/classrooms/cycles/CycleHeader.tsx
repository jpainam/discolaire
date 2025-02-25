"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { CreateEditCycle } from "./CreateEditCycle";

export function CycleHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-2 px-2">
      <Label>{t("cycles")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openModal({
              className: "w-96",
              title: t("create"),
              view: <CreateEditCycle />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
