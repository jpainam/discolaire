import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

export default async function Page() {
  const canAddStudent = await checkPermissions(
    PermissionAction.CREATE,
    "student:profile",
  );
  if (!canAddStudent) {
    return <NoPermission className="my-8" />;
  }

  return <div></div>;
}
