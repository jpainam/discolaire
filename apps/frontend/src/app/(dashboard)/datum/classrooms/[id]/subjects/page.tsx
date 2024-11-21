import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

import { SubjectHeader } from "~/components/classrooms/subjects/SubjectHeader";
import { SubjectTable } from "~/components/classrooms/subjects/SubjectTable";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

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
  const subjects = await api.classroom.subjects(id);
  return (
    <div className="flex w-full flex-col">
      <SubjectHeader subjects={subjects} />

      <SubjectTable classroomId={id} />
    </div>
  );
}
