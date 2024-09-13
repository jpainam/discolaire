import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

import { CreateUpdateAddress } from "~/components/students/profile/CreateUpdateAddress";
import { CreateUpdateDenom } from "~/components/students/profile/CreateUpdateDenom";
import { CreateUpdateProfile } from "~/components/students/profile/CreateUpdateProfile";

export default async function Page() {
  const canAddStudent = await checkPermissions(
    PermissionAction.CREATE,
    "student:profile",
  );
  if (!canAddStudent) {
    return <NoPermission className="my-8" />;
  }

  return (
    <div className="grid grid-cols-1 gap-4 p-2 xl:grid-cols-2">
      <CreateUpdateProfile />
      <CreateUpdateAddress />
      <CreateUpdateDenom />
    </div>
  );
}
