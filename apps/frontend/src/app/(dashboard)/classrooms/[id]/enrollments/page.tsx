import { checkPermissions } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { EnrollmentDataTable } from "~/components/classrooms/enrollments/EnrollmentDataTable";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const canReadClassroom = await checkPermissions(
    PermissionAction.READ,
    "classroom:enrollment"
  );
  if (!canReadClassroom) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return (
    <div className="flex flex-col p-4">
      <EnrollmentDataTable classroomId={id} />
    </div>
  );
}
