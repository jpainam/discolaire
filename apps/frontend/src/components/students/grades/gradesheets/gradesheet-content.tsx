"use client";

import { GradeSheetTable } from "./gradesheet-table";

export function GradeSheetContent({ studentId }: { studentId: string }) {
  return (
    <div className="pr-4">
      <GradeSheetTable studentId={studentId} />
    </div>
  );
}
