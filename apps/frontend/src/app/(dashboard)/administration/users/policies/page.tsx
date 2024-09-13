import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";

import { PolicyHeader } from "~/components/administration/policies/PolicyHeader";
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
  return (
    <div className="flex flex-col">
      <PolicyHeader />
      <PolicyTable canDelete={canDeletePolicy} canEdit={canEditPolicy} />
    </div>
  );
}
