"use client";

import { useLocale } from "@/hooks/use-locale";
import { GradeSheetTable } from "./gradesheet-table";

export function GradeSheetContent({ studentId }: { studentId: string }) {
  const { t } = useLocale();

  return (
    <div className="pr-4">
      <GradeSheetTable studentId={studentId} />
    </div>
  );
}
