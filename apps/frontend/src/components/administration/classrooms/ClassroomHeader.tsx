"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

import { Label } from "@repo/ui/components/label";
import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";

export function ClassroomHeader() {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  return (
    <div className="flex flex-row px-4 bg-muted/50 py-1 border-y justify-between items-center gap-2">
      <Label>{t("classrooms")}</Label>
      <Button
        variant={"default"}
        size={"sm"}
        onClick={() => {
          openSheet({
            title: t("create_a_classroom"),
            description: t("create_classroom_description"),
            view: <CreateEditClassroom />,
          });
        }}
      >
        <PlusIcon />
        {t("create")}
      </Button>
    </div>
  );
}
