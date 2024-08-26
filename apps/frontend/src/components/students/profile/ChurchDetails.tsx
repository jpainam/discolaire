"use client";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { ChurchDetailsForm } from "./ChurchDetailsForm";

export function ChurchDetails() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="border-l px-2">
      <div className="grid grid-cols-2 gap-y-3 px-2">
        <span className="text-muted-foreground">
          {t("church_family_attends")}
        </span>
        <span>xxx</span>
        <span className="text-muted-foreground">{t("placeOfBirth")}</span>
        <span>xxx</span>
      </div>
      <Button
        onClick={() => {
          openModal({
            title: t("edit_church_info"),
            className: "w-[700px]",
            view: <ChurchDetailsForm />,
          });
        }}
      >
        Edit church Info
      </Button>
    </div>
  );
}
