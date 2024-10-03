"use client";

import { PlusIcon } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { CreateEditStaffLevel } from "./CreateEditStaffLevel";

export function StaffLevelAction() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal({
          className: "w-[400px]",
          title: t("create"),
          view: <CreateEditStaffLevel />,
        });
      }}
      variant={"default"}
      size={"sm"}
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      {t("add")}
    </Button>
  );
}
