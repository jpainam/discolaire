import type { PropsWithChildren } from "react";

import { checkPermission } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

export default async function Layout({ children }: PropsWithChildren) {
  const canReadStaff = await checkPermission("staff", PermissionAction.READ);
  if (!canReadStaff) {
    return <NoPermission className="my-8" isFullPage resourceText="" />;
  }
  return <>{children}</>;
}
