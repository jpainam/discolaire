"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { CreateUpdateJournal } from "./CreateUpdateJournal";

export function AccountingJournalHeader() {
  const canCreateFees = useCheckPermission("fee", PermissionAction.CREATE);
  const { openModal } = useModal();
  const t = useTranslations();
  return (
    <div className="flex flex-row items-center justify-between gap-2 px-4 py-2">
      <Label>{t("Accounting Journals")}</Label>
      <div className="flex items-center justify-end gap-2">
        {canCreateFees && (
          <Button
            onClick={() => {
              openModal({
                title: t("create"),
                view: <CreateUpdateJournal />,
              });
            }}
            size="sm"
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
      </div>
    </div>
  );
}
