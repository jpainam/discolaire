import type { PropsWithChildren } from "react";

import { checkPermissions } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

export default async function Layout({ children }: PropsWithChildren) {
  const canReadStaff = await checkPermissions(
    PermissionAction.READ,
    "staff:list"
  );
  if (!canReadStaff) {
    return <NoPermission className="my-8" isFullPage resourceText="" />;
  }
  return <>{children}</>;
}
