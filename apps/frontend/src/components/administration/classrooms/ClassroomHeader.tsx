"use client";

import { PlusIcon } from "lucide-react";

import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import { Label } from "@repo/ui/label";

import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";

export function ClassroomHeader() {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  return (
    <div className="flex items-center justify-between">
      <Label className="">{t("classrooms")}</Label>
      <Button
        variant={"default"}
        size={"sm"}
        onClick={() => {
          openSheet({
            title: t("add"),
            className: "w-[600px]",
            view: <CreateEditClassroom />,
          });
        }}
      >
        <PlusIcon className="mr-2 h-4 w-4" />
        {t("create")}
      </Button>
    </div>
  );
}
