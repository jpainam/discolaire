"use client";

import { PlusIcon, SendIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { useCheckPermission } from "~/hooks/use-permission";
import { CreateEditCommunicationChannel } from "./CreateEditCommunicationChannel";

export function CommunicationHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  const canSendCommunication = useCheckPermission("communication.create");
  return (
    <div className="bg-muted flex flex-row items-center gap-1 border-y px-4 py-1">
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
          >
            <PlusIcon />
            {t("add")}
          </Button>
        )}
      </div>
    </div>
  );
}
