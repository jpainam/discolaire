"use client";

import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { useModal } from "~/hooks/use-modal";
import { EditIcon } from "~/icons";

export function UserRoleDetailHeader({ roleId }: { roleId: string }) {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="flex items-center gap-4">
      <div className="ml-auto flex items-center gap-4">
        <Button variant={"secondary"}>
          <EditIcon />
          {t("edit")}
        </Button>
      </div>
    </div>
  );
}
