"use client";

import { PlusIcon } from "lucide-react";

import { useLocale } from "@repo/hooks/use-locale";
import { useModal } from "@repo/hooks/use-modal";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

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
