import { notFound } from "next/navigation";

import { GradeDataTable } from "~/components/classrooms/gradesheets/grades/GradeDataTable";
import { GradeHeader } from "~/components/classrooms/gradesheets/grades/GradeHeader";
import { api } from "~/trpc/server";

export default async function Page({
  params: { id, gradesheetId },
}: {
  params: { id: string; gradesheetId: number };
}) {
  const grades = await api.gradeSheet.grades(Number(gradesheetId));
  const gradesheet = await api.gradeSheet.get(Number(gradesheetId));
  if (!grades || !gradesheet) {
    notFound();
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <GradeHeader gradesheet={gradesheet} grades={grades} />
      <GradeDataTable gradeSheetId={gradesheetId} />
    </div>
  );
}
