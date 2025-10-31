import { PolicyTable } from "~/components/administration/policies/PolicyTable";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";

export default async function Page() {
  const canDeletePolicy = await checkPermission(
    "policy",
    PermissionAction.DELETE,
  );
  const canEditPolicy = await checkPermission(
    "policy",
    PermissionAction.UPDATE,
  );

  return <PolicyTable canDelete={canDeletePolicy} canEdit={canEditPolicy} />;
}
