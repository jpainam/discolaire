import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";

import { StudentAttendanceHeader } from "~/components/students/attendances/StudentAttendanceHeader";
import { api } from "~/trpc/server";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const { children } = props;
  const params = await props.params;

  const classroom = await api.student.classroom({ studentId: params.id });

  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }

  return (
    <div className="flex flex-col">
      <StudentAttendanceHeader
        classroomId={classroom.id}
        studentId={params.id}
      />
      {children}
    </div>
  );
}
