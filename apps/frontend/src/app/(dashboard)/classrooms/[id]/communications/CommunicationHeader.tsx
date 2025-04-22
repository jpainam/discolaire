"use client";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";
import { PlusIcon, SendIcon } from "lucide-react";
import { useLocale } from "~/i18n";

export function CommunicationHeader() {
  const { t } = useLocale();
  return (
    <div className="flex gap-1 px-4 py-1 bg-secondary border-b flex-row items-center">
      <SendIcon className="hidden md:block h-4 w-4" />
      <Label>{t("communications")}</Label>
      <div className="ml-auto">
        <Button size={"sm"}>
          <PlusIcon className="w-4 h-4" />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
