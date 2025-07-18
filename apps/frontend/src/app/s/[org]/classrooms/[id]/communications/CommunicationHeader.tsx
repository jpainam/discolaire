"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { PlusIcon, SendIcon } from "lucide-react";
import { useModal } from "~/hooks/use-modal";
import { useLocale } from "~/i18n";
import { CreateEditCommunicationChannel } from "./CreateEditCommunicationChannel";

export function CommunicationHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex gap-1 px-4 py-1 bg-muted text-muted-foreground border-b flex-row items-center">
      <SendIcon className="hidden md:block h-4 w-4" />
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
          <PlusIcon className="w-4 h-4" />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
