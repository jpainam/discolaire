import { GradeDataTable } from "~/components/classrooms/gradesheets/grades/GradeDataTable";
import { GradeDetailsHeader } from "~/components/classrooms/gradesheets/grades/GradeDetailsHeader";
import { api } from "~/trpc/server";

export default async function Page(props: {
  params: Promise<{ gradesheetId: number }>;
}) {
  const params = await props.params;

  const { gradesheetId } = params;

  const grades = await api.gradeSheet.grades(Number(gradesheetId));
  const gradesheet = await api.gradeSheet.get(Number(gradesheetId));

  return (
    <div className="flex w-full flex-col gap-2">
      <GradeDetailsHeader gradesheet={gradesheet} grades={grades} />
      <GradeDataTable grades={grades} />
    </div>
  );
}
