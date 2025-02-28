"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";

import { CreateEditRole } from "~/components/administration/users/CreateEditRole";

export function CreateRoleButton() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <Button
      size={"sm"}
      onClick={() => {
        openModal({
          className: "w-96",
          title: t("create") + " - " + t("role"),
          view: <CreateEditRole />,
        });
      }}
    >
      <PlusIcon />
      {t("add")}
    </Button>
  );
}
