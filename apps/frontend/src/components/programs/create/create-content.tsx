"use client";

import { ClassroomSelector } from "@/components/shared/selects/ClassroomSelector";
import { useLocale } from "@/hooks/use-locale";
import { Label } from "@repo/ui/label";

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
