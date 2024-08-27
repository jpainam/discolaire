import type { PropsWithChildren } from "react";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/no-permission";

export default async function Layout({ children }: PropsWithChildren) {
  const canReadStaff = await checkPermissions(PermissionAction.STAFF_READ, "*");
  if (!canReadStaff) {
    return <NoPermission isFullPage resourceText="" />;
  }
  return <>{children}</>;
}
