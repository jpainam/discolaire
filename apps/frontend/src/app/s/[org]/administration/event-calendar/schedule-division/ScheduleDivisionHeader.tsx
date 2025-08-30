"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { useModal } from "~/hooks/use-modal";
import { CreateEditScheduleDivision } from "./CreateEditScheduleDivision";

export function ScheduleDivisionHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-4">
      <Label>{t("Schedule division")}</Label>
      <div className="ml-auto">
        <Button
          size="sm"
          onClick={() => {
            openModal({
              title: "Ajouter un Créneau",
              view: <CreateEditScheduleDivision />,
            });
          }}
        >
          <Plus className="h-4 w-4" />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
