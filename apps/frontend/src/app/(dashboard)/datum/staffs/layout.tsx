import { PropsWithChildren } from "react";
import { NoPermission } from "@repo/ui/NoPermission";

import { checkPermissions } from "~/server/permission";
import { PermissionAction } from "~/types/permission";

export default async function Layout({ children }: PropsWithChildren) {
  const canReadStaff = await checkPermissions(PermissionAction.STAFF_READ, "*");
  if (!canReadStaff) {
    return <NoPermission isFullPage resourceText="" />;
  }
  return <>{children}</>;
}
