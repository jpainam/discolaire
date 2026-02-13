import { Suspense } from "react";
import { cookies } from "next/headers";
import Script from "next/script";

import { getSession } from "~/auth/server";
import { AppSidebar } from "~/components/ai/app-sidebar-chat";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />

      <Suspense fallback={<div className="flex h-dvh" />}>
        <SidebarWrapper>{children}</SidebarWrapper>
      </Suspense>
    </>
  );
}

async function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  const cookieStore = await cookies();
  const isCollapsed = cookieStore.get("sidebar_state")?.value !== "true";

  return (
    <SidebarProvider defaultOpen={!isCollapsed}>
      <AppSidebar user={session?.user} />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
