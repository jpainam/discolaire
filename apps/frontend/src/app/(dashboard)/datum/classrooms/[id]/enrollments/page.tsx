import { checkPermissions } from "@repo/api/permission";
import { NoPermission } from "@repo/ui/no-permission";

import EnrollmentDataTable from "~/components/classrooms/enrollments/EnrollmentDataTable";
import { PermissionAction } from "~/types/permission";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const canReadClassroom = await checkPermissions(
    PermissionAction.READ,
    "classroom:enrollment",
  );
  if (!canReadClassroom) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return (
    <div className="flex flex-col">
      <EnrollmentDataTable classroomId={id} />
    </div>
  );
}
