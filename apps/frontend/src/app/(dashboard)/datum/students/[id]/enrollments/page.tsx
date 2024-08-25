import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";

import { StudentEnrollmentHeader } from "~/components/students/enrollments/StudentEnrollmentHeader";
import { StudentEnrollmentTable } from "~/components/students/enrollments/StudentEnrollmentTable";
import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { t } = await getServerTranslations();
  const classroom = await api.student.classroom(id);
  const enrollments = await api.student.enrollments(id);

  return (
    <div className="flex flex-col">
      <StudentEnrollmentHeader isEnrolled={classroom !== null} />
      {enrollments ? (
        <StudentEnrollmentTable enrollments={enrollments} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
