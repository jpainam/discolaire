import type { PropsWithChildren } from "react";

import { UpdateAdminBreadcrumb } from "./UpdateAdminBreadcrumb";

export default function Layout({ children }: PropsWithChildren) {
  //const session = await getSession();
  // const canSeeAdminMenu = await checkPermission(
  //   "menu:administration",
  //   PermissionAction.READ,
  // );
  // if (!canSeeAdminMenu) {
  //   redirect("/");
  // }
  return (
    <div className="flex flex-col">
      <UpdateAdminBreadcrumb />
      {children}
    </div>
  );
}
