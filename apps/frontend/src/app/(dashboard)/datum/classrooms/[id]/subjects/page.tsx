import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

import { SubjectDataTable } from "~/components/classrooms/subjects/SubjectDataTable";
import { SubjectHeader } from "~/components/classrooms/subjects/SubjectHeader";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const canReadClassroomSubject = await checkPermissions(
    PermissionAction.READ,
    "classroom:subject",
    {
      id: id,
    },
  );
  if (!canReadClassroomSubject) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return (
    <div className="flex w-full flex-col">
      <SubjectHeader />
      {/* <SubjectStats subjects={subjects} /> */}
      <SubjectDataTable />
    </div>
  );
}
