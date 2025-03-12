"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { CreateEditStaffLevel } from "./CreateEditStaffLevel";

export function StaffLevelAction() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal({
          title: t("create"),
          view: <CreateEditStaffLevel />,
        });
      }}
      variant={"default"}
      size={"sm"}
    >
      <PlusIcon />
      {t("add")}
    </Button>
  );
}
