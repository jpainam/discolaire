"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { KeySquare, PlusIcon } from "lucide-react";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { CreateEditPermission } from "./CreateEditPermission";

export function PermissionAction() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row justify-between items-center bg-muted border-b text-muted-foreground px-4 py-1">
      <div className="flex flex-row items-center gap-2">
        <KeySquare />
        <Label>{t("permissions")}</Label>
      </div>
      <div className="ml-auto">
        <Button
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
