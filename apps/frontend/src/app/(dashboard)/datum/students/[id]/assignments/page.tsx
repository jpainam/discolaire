import { getServerTranslations } from "@repo/i18n/server";
import { EmptyState } from "@repo/ui/EmptyState";
import { Separator } from "@repo/ui/separator";

import { StudentAssignmentTable } from "~/components/students/assignments/StudentAssignementTable";
import { StudentAssignmentHeader } from "~/components/students/assignments/StudentAssignmentHeader";
import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const classroom = await api.student.classroom(id);
  const { t } = await getServerTranslations();
  if (!classroom) {
    return (
      <EmptyState className="my-8" title={t("student_not_registered_yet")} />
    );
  }
  const assignments = await api.classroom.assignments(id);
  return (
    <div className="flex flex-col">
      <StudentAssignmentHeader />
      <Separator />
      <div className="p-2">
        <StudentAssignmentTable assignments={assignments} />
      </div>
    </div>
  );
}
