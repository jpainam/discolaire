import React from "react";

import { checkPermissions } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

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
