import type { PropsWithChildren } from "react";

import { SidebarInset, SidebarProvider } from "@repo/ui/sidebar";

import { AppSidebar } from "~/components/administration/app-sidebar";
import { AdministrationPageHeader } from "./AdministrationPageHeader";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSidebar className="pt-[95px]" />
      <SidebarInset className="pt-[90px]">
        <AdministrationPageHeader />
        <div className="flex flex-1 flex-col gap-4 px-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
