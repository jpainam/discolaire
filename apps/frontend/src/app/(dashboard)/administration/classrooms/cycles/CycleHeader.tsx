"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { CreateEditCycle } from "./CreateEditCycle";

export function CycleHeader() {
  const t = useTranslations();
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
          <PlusIcon />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
