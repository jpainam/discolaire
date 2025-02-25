import { Separator } from "@repo/ui/components/separator";
import { EmptyState } from "~/components/EmptyState";
import { getServerTranslations } from "~/i18n/server";

import { StudentAssignmentTable } from "~/components/students/assignments/StudentAssignementTable";
import { StudentAssignmentHeader } from "~/components/students/assignments/StudentAssignmentHeader";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const classroom = await api.student.classroom({ studentId: id });
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
