import type { PropsWithChildren } from "react";

import { redirect } from "next/navigation";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { UpdateAdminBreadcrumb } from "./UpdateAdminBreadcrumb";

export default async function Layout({ children }: PropsWithChildren) {
  //const session = await getSession();
  const canSeeAdminMenu = await checkPermission(
    "menu:administration",
    PermissionAction.READ
  );
  if (!canSeeAdminMenu) {
    redirect("/");
  }
  return (
    <div className="flex flex-col">
      <UpdateAdminBreadcrumb />
      {children}
    </div>
  );
}
