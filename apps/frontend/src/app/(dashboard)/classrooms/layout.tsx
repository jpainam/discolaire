import React from "react";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "~/permissions";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const canReadClassroom = await checkPermissions(
    PermissionAction.READ,
    "classroom:list",
  );
  if (!canReadClassroom) {
    console.warn("No permission");
    //return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return <>{children}</>;
}
