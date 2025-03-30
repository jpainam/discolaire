import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { StudentGrade } from "~/components/students/grades/StudentGrade";
import { StudentGradeHeader } from "~/components/students/grades/StudentGradeHeader";
import { api, caller } from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ term?: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;

  const classroom = await api.student.classroom({ studentId: id });
  const student = await api.student.get(id);
  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  const searchParams = await props.searchParams;
  const term = searchParams?.term;
  const grades = await caller.student.grades({
    id: params.id,
    termId: term ? Number(term) : undefined,
  });

  const moyMinMaxGrades = await caller.classroom.getMinMaxMoyGrades(
    classroom.id,
  );

  if (grades.length === 0) {
    return <EmptyState title={t("no_data")} className="my-8" />;
  }

  return (
    <div className="flex h-full w-full flex-col">
      <StudentGradeHeader student={student} classroomId={classroom.id} />
      <div className="grid gap-0 p-0 pb-2 text-sm md:grid-cols-2">
        <StudentGrade moyMinMaxGrades={moyMinMaxGrades} grades={grades} />
        {children}
      </div>
    </div>
  );
}
