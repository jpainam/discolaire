"use client";

import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useSheet } from "~/hooks/use-sheet";

export function ClassroomHeader() {
  const t = useTranslations();
  const { openSheet } = useSheet();
  return (
    <div className="bg-muted/50 flex flex-row items-center justify-between gap-2 border-y px-4 py-1">
      <Label>{t("classrooms")}</Label>
      <Button
        onClick={() => {
          const formId = "create-classroom-form";
          openSheet({
            formId,
            title: t("create"),
            description: t("classroom"),
            view: <CreateEditClassroom formId={formId} />,
          });
        }}
      >
        <PlusIcon />
        {t("create")}
      </Button>
    </div>
  );
}
