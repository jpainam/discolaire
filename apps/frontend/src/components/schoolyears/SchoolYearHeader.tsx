"use client";

import { PlusIcon } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { CreateEditSchoolYear } from "./CreateEditSchoolYear";

export function SchoolYearHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center p-2">
      <Label>{t("schoolYear")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openModal({
              title: `${t("create")} - ${t("schoolYear")}`,
              className: "w-96",
              view: <CreateEditSchoolYear />,
            });
          }}
          variant={"default"}
          size={"sm"}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
