import React from "react";

import { checkPermission } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { children } = props;
  const canReadStudent = await checkPermission(
    "classroom",
    PermissionAction.READ,
  );
  if (!canReadStudent) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return <>{children}</>;
}
