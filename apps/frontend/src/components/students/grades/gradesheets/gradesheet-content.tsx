"use client";

import { useLocale } from "@repo/i18n";

import { GradeSheetTable } from "./gradesheet-table";

export function GradeSheetContent({ studentId }: { studentId: string }) {
  const { t } = useLocale();

  return (
    <div className="pr-4">
      <GradeSheetTable studentId={studentId} />
    </div>
  );
}
