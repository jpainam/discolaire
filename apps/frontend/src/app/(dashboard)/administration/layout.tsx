import type { PropsWithChildren } from "react";

import { checkPermissions } from "@repo/api/permission";
import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

import { AppSidebar } from "~/components/administration/app-sidebar";
import { PageHeader } from "~/components/administration/PageHeader";

export default async function Layout({ children }: PropsWithChildren) {
  const canSeeAdminMenu = await checkPermissions(
    PermissionAction.READ,
    "menu:administration"
  );
  if (!canSeeAdminMenu) {
    return <NoPermission className="md:mt-[120px]" />;
  }
  return (
    <SidebarProvider>
      <AppSidebar className="pt-[95px]" />
      <SidebarInset className="pt-[90px]">
        <PageHeader />
        <div className="flex flex-1 flex-col gap-4 px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
