"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { KeySquare, PlusIcon } from "lucide-react";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { CreateEditPermission } from "./CreateEditPermission";
import { CreateEditPermissionGroup } from "./CreateEditPermissionGroup";

export function PermissionAction() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row justify-between items-center bg-muted border-b text-muted-foreground px-4 py-1">
      <div className="flex flex-row items-center gap-2">
        <KeySquare />
        <Label>{t("permissions")}</Label>
      </div>
      <div className="ml-auto flex flex-row items-center gap-2">
        <Button
          variant={"outline"}
          size={"sm"}
          onClick={() => {
            openModal({
              className: "w-96",
              view: <CreateEditPermissionGroup />,
              title: t("create_group"),
            });
          }}
        >
          <PlusIcon />
          {t("create_group")}
        </Button>
        <Button
          size={"sm"}
          onClick={() => {
            openModal({
              className: "w-96",
              view: <CreateEditPermission />,
              title: t("create_permission"),
            });
          }}
        >
          <PlusIcon />
          {t("create")}
        </Button>
      </div>
    </div>
  );
}
