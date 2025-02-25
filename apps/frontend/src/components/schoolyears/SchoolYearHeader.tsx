"use client";

import { PlusIcon } from "lucide-react";

import { useModal } from "~/hooks/use-modal";
import { Button } from "@repo/ui/components/button";
import { useLocale } from "~/i18n";

import { CreateEditSchoolYear } from "./CreateEditSchoolYear";

export function SchoolYearHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
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
  );
}
