import { checkPermission } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { UpdateStudent } from "~/components/students/profile/UpdateStudent";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const student = await api.student.get(id);
  const canEditStudent = await checkPermission(
    "student",
    PermissionAction.UPDATE,
  );
  if (!canEditStudent) {
    return <NoPermission className="my-8" />;
  }

  return <UpdateStudent student={student} />;
}
