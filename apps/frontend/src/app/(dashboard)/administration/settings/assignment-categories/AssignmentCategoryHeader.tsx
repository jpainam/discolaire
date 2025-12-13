"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useModal } from "~/hooks/use-modal";
import { CreateEditAssignmentCategory } from "./CreateEditAssignementCategory";

export function AssignmentCategoryHeader() {
  const t = useTranslations();
  const { openModal } = useModal();
  return (
    <div className="flex flex-row items-center gap-2 px-4 py-2">
      <Label>{t("assignment_categories")}</Label>
      <div className="ml-auto">
        <Button
          onClick={() => {
            openModal({
              title: t("create"),
              view: <CreateEditAssignmentCategory />,
            });
          }}
          size={"sm"}
          variant={"default"}
        >
          <PlusIcon />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
