"use client";

import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { PlusIcon } from "~/icons";
import { CreateEditUserRole } from "./CreateEditUserRole";

export function UserRoleHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="flex items-center gap-4 px-4 pt-4">
      <Label>{t("roles")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openModal({
              title: t("add"),
              className: "sm:max-w-xl",
              description: t("role"),
              view: <CreateEditUserRole />,
            });
          }}
        >
          <PlusIcon />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
