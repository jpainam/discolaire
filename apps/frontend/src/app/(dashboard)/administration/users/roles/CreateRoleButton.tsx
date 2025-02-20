"use client";

import { PlusIcon } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/components/button";

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
      <PlusIcon className="mr-2 h-4 w-4" />
      {t("add")}
    </Button>
  );
}
