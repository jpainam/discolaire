import React from "react";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "@repo/lib/permission";
import { NoPermission } from "@repo/ui/components/no-permission";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const canListStudent = await checkPermissions(
    PermissionAction.READ,
    "student:list",
  );
  if (!canListStudent) {
    return <NoPermission isFullPage resourceText="" className="my-8" />;
  }
  return <>{children}</>;
}
