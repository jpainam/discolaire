"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { CreateEditClub } from "./CreateEditClub";

export function ClubAction() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Button
      onClick={() => {
        openModal({
          className: "w-[400px]",
          title: t("create"),
          view: <CreateEditClub />,
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
