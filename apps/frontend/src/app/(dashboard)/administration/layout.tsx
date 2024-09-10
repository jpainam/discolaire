import type { PropsWithChildren } from "react";

import { AppSidebar } from "~/components/administration/app-sidebar";
import {
  SidebarLayout,
  SidebarTrigger,
} from "~/components/administration/sidebar";

export default async function Layout({ children }: PropsWithChildren) {
  const { cookies } = await import("next/headers");
  return (
    <SidebarLayout
      defaultOpen={cookies().get("sidebar:state")?.value === "true"}
      className="min-h-[calc(100vh-12rem)]"
    >
      <AppSidebar />
      <main className="flex-colp-2 flex-1 flex-col transition-all duration-300 ease-in-out">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarLayout>
  );
}
