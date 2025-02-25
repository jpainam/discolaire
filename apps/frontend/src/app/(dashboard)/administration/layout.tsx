import type { PropsWithChildren } from "react";

import { checkPermissions } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

export default async function Layout({ children }: PropsWithChildren) {
  const canSeeAdminMenu = await checkPermissions(
    PermissionAction.READ,
    "menu:administration"
  );
  if (!canSeeAdminMenu) {
    return <NoPermission className="md:mt-[120px]" />;
  }
  return <>{children}</>;
}
