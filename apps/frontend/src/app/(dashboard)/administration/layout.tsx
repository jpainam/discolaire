import React from "react";
import { cookies } from "next/headers";

import { AppSidebar } from "~/components/administration/app-sidebar";
import { SidebarLayout } from "~/components/administration/sidebar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarLayout
      defaultOpen={(await cookies()).get("sidebar:state")?.value === "true"}
    >
      <AppSidebar />
      <main className="flex-colp-2 flex-1 flex-col pt-[90px] transition-all duration-300 ease-in-out">
        {children}
      </main>
    </SidebarLayout>
  );
}
