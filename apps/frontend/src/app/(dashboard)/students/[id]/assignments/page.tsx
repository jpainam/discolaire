import { getTranslations } from "next-intl/server";

import { EmptyComponent } from "~/components/EmptyComponent";
import { StudentAssignmentTable } from "~/components/students/assignments/StudentAssignementTable";
import { StudentAssignmentHeader } from "~/components/students/assignments/StudentAssignmentHeader";
import { Separator } from "~/components/ui/separator";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const classroom = await caller.student.classroom({ studentId: id });
  const t = await getTranslations();
  if (!classroom) {
    return <EmptyComponent title={t("student_not_registered_yet")} />;
  }
  const assignments = await caller.classroom.assignments(id);
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
