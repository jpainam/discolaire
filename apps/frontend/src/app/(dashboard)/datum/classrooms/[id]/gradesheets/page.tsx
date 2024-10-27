import { GradeSheetDataTable } from "~/components/classrooms/gradesheets/GradeSheetDataTable";
import { GradeSheetHeader } from "~/components/classrooms/gradesheets/GradeSheetHeader";
import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ term: number; subject: number }>;
}) {
  const searchParams = await props.searchParams;

  const { term, subject } = searchParams;

  const params = await props.params;

  const { id } = params;

  let gradesheets = await api.classroom.gradesheets(id);
  if (subject && isFinite(subject)) {
    gradesheets = gradesheets.filter((g) => g.subjectId == subject);
  }
  if (term && isFinite(term)) {
    gradesheets = gradesheets.filter((g) => g.termId == Number(term));
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <GradeSheetHeader />
      <GradeSheetDataTable gradesheets={gradesheets} />
    </div>
  );
}
