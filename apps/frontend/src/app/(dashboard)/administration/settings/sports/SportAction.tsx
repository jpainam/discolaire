"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { CreateEditSport } from "./CreateEditSport";

export function SportAction() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal({
          className: "w-[400px]",
          title: t("create"),
          view: <CreateEditSport />,
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
