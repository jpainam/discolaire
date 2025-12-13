"use client";

import { PlusIcon, SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { CreateEditCommunicationChannel } from "./CreateEditCommunicationChannel";

export function CommunicationHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  const canSendCommunication = useCheckPermission(
    "communication",
    PermissionAction.CREATE,
  );
  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-1 border-b px-4 py-1">
      <SendIcon className="hidden h-4 w-4 md:block" />
      <Label>{t("communications")}</Label>
      <div className="ml-auto">
        {canSendCommunication && (
          <Button
            onClick={() => {
              openModal({
                title: t("communications"),
                view: <CreateEditCommunicationChannel />,
              });
            }}
            size={"sm"}
          >
            <PlusIcon className="h-4 w-4" />
            {t("add")}
          </Button>
        )}
      </div>
    </div>
  );
}
