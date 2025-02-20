import type { PropsWithChildren } from "react";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/components/no-permission";

export default async function Layout({ children }: PropsWithChildren) {
  const canReadStaff = await checkPermissions(
    PermissionAction.READ,
    "staff:list",
  );
  if (!canReadStaff) {
    return <NoPermission className="my-8" isFullPage resourceText="" />;
  }
  return <>{children}</>;
}
