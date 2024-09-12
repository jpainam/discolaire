import { notFound } from "next/navigation";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

import { CreateUpdateAddress } from "~/components/students/profile/CreateUpdateAddress";
import { CreateUpdateDenom } from "~/components/students/profile/CreateUpdateDenom";
import { CreateUpdateProfile } from "~/components/students/profile/CreateUpdateProfile";
import { api } from "~/trpc/server";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
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
  return (
    <div className="grid grid-cols-1 gap-4 p-2 xl:grid-cols-2">
      <CreateUpdateProfile student={student} />
      <CreateUpdateAddress />
      <CreateUpdateDenom />
    </div>
  );
}
