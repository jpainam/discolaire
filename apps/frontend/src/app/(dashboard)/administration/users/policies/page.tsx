import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";

import { PolicyTable } from "~/components/administration/policies/PolicyTable";

export default async function Page() {
  const canDeletePolicy = await checkPermissions(
    PermissionAction.DELETE,
    "policy",
  );
  const canEditPolicy = await checkPermissions(
    PermissionAction.UPDATE,
    "policy",
  );

  return <PolicyTable canDelete={canDeletePolicy} canEdit={canEditPolicy} />;
}
