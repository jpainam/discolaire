import React from "react";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "~/permissions";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;
  const canReadStudent = await checkPermissions(
    PermissionAction.READ,
    "classroom:details",
    {
      id: id,
    },
  );
  if (!canReadStudent) {
    console.warn("No permission");
    //return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return <>{children}</>;
}
