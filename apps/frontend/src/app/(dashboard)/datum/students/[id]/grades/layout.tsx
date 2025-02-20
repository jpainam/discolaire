import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/components/EmptyState";

import { StudentGrade } from "~/components/students/grades/StudentGrade";
import { StudentGradeHeader } from "~/components/students/grades/StudentGradeHeader";
import { api } from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
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

  return (
    <div className="flex h-full w-full flex-col">
      <StudentGradeHeader student={student} classroomId={classroom.id} />
      <div className="grid gap-0 p-0 pb-2 text-sm md:grid-cols-2">
        <StudentGrade classroomId={classroom.id} studentId={id} />
        {children}
      </div>
    </div>
  );
}
