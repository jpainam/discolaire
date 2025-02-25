import { checkPermissions } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { CreateStudent } from "~/components/students/profile/CreateStudent";

export default async function Page() {
  const canCreateStudent = await checkPermissions(
    PermissionAction.CREATE,
    "student:profile",
  );
  if (!canCreateStudent) {
    return <NoPermission className="my-8" />;
  }

  return <CreateStudent />;
}
