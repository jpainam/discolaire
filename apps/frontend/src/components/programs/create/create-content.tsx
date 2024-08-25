"use client";

import { useLocale } from "@repo/i18n";
import { Label } from "@repo/ui/label";

import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";

export function CreateProgramContent() {
  const { t } = useLocale();
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center gap-4 bg-muted px-4 py-1">
        <Label>{t("classrooms")}</Label>
        <ClassroomSelector />
      </div>
    </div>
  );
}
