import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";

import { PolicyTable } from "~/components/administration/policies/PolicyTable";

export default async function Page() {
  const canDeletePolicy = await checkPermission(
    "policy",
    PermissionAction.DELETE
  );
  const canEditPolicy = await checkPermission(
    "policy",
    PermissionAction.UPDATE
  );

  return <PolicyTable canDelete={canDeletePolicy} canEdit={canEditPolicy} />;
}
