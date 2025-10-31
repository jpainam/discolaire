"use client";

import { PlusIcon, SendIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { CreateEditCommunicationChannel } from "./CreateEditCommunicationChannel";

export function CommunicationHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="bg-muted text-muted-foreground flex flex-row items-center gap-1 border-b px-4 py-1">
      <SendIcon className="hidden h-4 w-4 md:block" />
      <Label>{t("communications")}</Label>
      <div className="ml-auto">
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
      </div>
    </div>
  );
}
