import { GradeSheetDataTable } from "@/components/classrooms/gradesheets/GradeSheetDataTable";
import { GradeSheetHeader } from "@/components/classrooms/gradesheets/GradeSheetHeader";
import { api } from "@/trpc/server";

export default async function Page({
  params: { id },
  searchParams: { term, subject },
}: {
  params: { id: string };
  searchParams: { term: number; subject: number };
}) {
  let gradesheets = await api.classroom.gradesheets(id);
  if (subject && isFinite(subject)) {
    gradesheets = gradesheets.filter((g) => g.subjectId == subject);
  }
  if (term && isFinite(term)) {
    gradesheets = gradesheets.filter((g) => g.termId == Number(term));
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <GradeSheetHeader />
      <GradeSheetDataTable gradesheets={gradesheets} />
    </div>
  );
}
