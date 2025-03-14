import type { PropsWithChildren } from "react";

import { PermissionAction } from "@repo/api";
import { checkPermission } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { UpdateAdminBreadcrumb } from "./UpdateAdminBreadcrumb";

export default async function Layout({ children }: PropsWithChildren) {
  const canSeeAdminMenu = await checkPermission(
    "menu:administration",
    PermissionAction.READ
  );
  if (!canSeeAdminMenu) {
    return <NoPermission className="md:mt-[120px]" />;
  }
  return (
    <>
      <UpdateAdminBreadcrumb />
      {children}
    </>
  );
}
