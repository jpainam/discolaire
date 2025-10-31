import { NoPermission } from "~/components/no-permission";
import { CreateStudent } from "~/components/students/profile/CreateStudent";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";

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
