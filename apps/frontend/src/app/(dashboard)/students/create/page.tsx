import { checkPermission } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { CreateStudent } from "~/components/students/profile/CreateStudent";

export default async function Page() {
  const canCreateStudent = await checkPermission(
    "student",
    PermissionAction.CREATE,
  );
  if (!canCreateStudent) {
    return <NoPermission className="my-8" />;
  }

  return <CreateStudent />;
}
