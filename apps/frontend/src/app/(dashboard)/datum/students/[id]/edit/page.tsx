import { notFound } from "next/navigation";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

import { UpdateStudent } from "~/components/students/profile/UpdateStudent";
import { api } from "~/trpc/server";

export default async function Page(
  props: {
    params: Promise<{ id: string }>;
  }
) {
  const params = await props.params;

  const {
    id
  } = params;

  const student = await api.student.get(id);
  const canEditStudent = await checkPermissions(
    PermissionAction.UPDATE,
    "student:profile",
    { id },
  );
  if (!canEditStudent) {
    return <NoPermission className="my-8" />;
  }
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!student) {
    notFound();
  }
  return <UpdateStudent student={student} />;
}
