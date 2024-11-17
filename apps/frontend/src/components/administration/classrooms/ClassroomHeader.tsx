"use client";

import { PlusIcon } from "lucide-react";

import { useSheet } from "@repo/hooks/use-sheet";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";

import { CreateEditClassroom } from "~/components/classrooms/CreateEditClassroom";

export function ClassroomHeader() {
  const { t } = useLocale();
  const { openSheet } = useSheet();
  return (
    <Button
      variant={"default"}
      size={"sm"}
      onClick={() => {
        openSheet({
          title: <span className="px-4">{t("add")}</span>,
          className: "w-[600px]",
          view: <CreateEditClassroom />,
        });
      }}
    >
      <PlusIcon className="mr-2 h-4 w-4" />
      {t("create")}
    </Button>
  );
}
