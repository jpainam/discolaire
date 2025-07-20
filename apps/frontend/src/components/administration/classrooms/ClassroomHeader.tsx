"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { Label } from "@repo/ui/components/label";

import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

export function ClassroomHeader() {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  return (
    <div className="bg-muted/50 flex flex-row items-center justify-between gap-2 border-y px-4 py-1">
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
