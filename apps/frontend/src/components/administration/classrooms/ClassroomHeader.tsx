"use client";

import { PlusIcon } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import { useSheet } from "~/hooks/use-sheet";
import { useLocale } from "~/i18n";

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
          title: t("create_a_classroom"),
          description: t("create_classroom_description"),
          view: <CreateEditClassroom />,
        });
      }}
    >
      <PlusIcon />
      {t("create")}
    </Button>
  );
}
