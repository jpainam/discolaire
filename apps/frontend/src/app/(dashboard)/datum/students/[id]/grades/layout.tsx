import { getServerTranslations } from "~/app/i18n/server";
import { EmptyState } from "~/components/EmptyState";
import { StudentGrade } from "~/components/students/grades/StudentGrade";
import { StudentGradeHeader } from "~/components/students/grades/StudentGradeHeader";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const classroom = await api.student.classroom(id);
  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState
        className="my-8"
        title={t("no_data")}
        description={t("student_not_registered_yet")}
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col">
      <StudentGradeHeader studentId={id} classroomId={classroom.id} />
      <div className="grid gap-0 p-0 pb-2 text-sm md:grid-cols-2">
        <StudentGrade classroomId={classroom.id} studentId={id} />
        {children}
      </div>
    </div>
  );
}
