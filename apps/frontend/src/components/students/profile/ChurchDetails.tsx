"use client";

import { useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";

import { useModal } from "~/hooks/use-modal";
import { ChurchDetailsForm } from "./ChurchDetailsForm";

export function ChurchDetails() {
  const t = useTranslations();
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
