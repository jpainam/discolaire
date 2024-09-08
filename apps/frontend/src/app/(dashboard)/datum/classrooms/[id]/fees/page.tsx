import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

import { ClassroomFeeHeader } from "~/components/classrooms/fees/ClassroomFeeHeader";
import { ClassroomFeeTable } from "~/components/classrooms/fees/ClassroomFeeTable";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const canReadClassroomFee = await checkPermissions(
    PermissionAction.READ,
    "classroom:fee",
    {
      id: id,
    },
  );
  if (!canReadClassroomFee) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return (
    <div className="flex w-full flex-col gap-2">
      <ClassroomFeeHeader />
      <ClassroomFeeTable classroomId={id} />
    </div>
  );
}
