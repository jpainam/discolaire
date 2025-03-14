import { checkPermission } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { EnrollmentDataTable } from "~/components/classrooms/enrollments/EnrollmentDataTable";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const canReadClassroom = await checkPermission(
    "enrollment",
    PermissionAction.READ,
  );
  if (!canReadClassroom) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  const students = await api.classroom.students(params.id);
  return (
    <div className="flex flex-col p-4">
      <EnrollmentDataTable students={students} />
    </div>
  );
}
