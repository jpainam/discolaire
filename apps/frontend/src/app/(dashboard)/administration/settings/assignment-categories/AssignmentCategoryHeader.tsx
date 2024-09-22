"use client";

import { PlusIcon } from "lucide-react";

import { useModal } from "@repo/hooks/use-modal";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { CreateEditAssignmentCategory } from "./CreateEditAssignementCategory";

export function AssignmentCategoryHeader() {
  const { t } = useLocale();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-2 px-4 py-2">
      <Label>{t("assignment_categories")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openModal({
              className: "w-[400px]",
              title: t("create"),
              view: <CreateEditAssignmentCategory />,
            });
          }}
          size={"sm"}
          variant={"default"}
        >
          <PlusIcon className="mr-2 h-4 w-4" />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
