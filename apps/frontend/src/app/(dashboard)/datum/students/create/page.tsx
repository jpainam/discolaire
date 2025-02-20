import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/components/no-permission";

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
