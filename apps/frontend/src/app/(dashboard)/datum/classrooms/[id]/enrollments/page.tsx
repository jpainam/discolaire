import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

import { EnrollmentDataTable } from "~/components/classrooms/enrollments/EnrollmentDataTable";

export default async function Page(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const canReadClassroom = await checkPermissions(
    PermissionAction.READ,
    "classroom:enrollment",
  );
  if (!canReadClassroom) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return (
    <div className="flex flex-col px-2">
      <EnrollmentDataTable classroomId={id} />
    </div>
  );
}
