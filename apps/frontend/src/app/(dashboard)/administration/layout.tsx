import type { PropsWithChildren } from "react";

import { checkPermission } from "~/permissions/server";
import { redirect } from "next/navigation";
import { PermissionAction } from "~/permissions";
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
    <>
      <UpdateAdminBreadcrumb />
      {children}
    </>
  );
}
