import { cookies } from "next/headers";

import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";
import { redirect } from "next/navigation";
import Script from "next/script";
import { getSession } from "~/auth/server";
import { AppSidebar } from "~/components/ai/app-sidebar";
import { DataStreamProvider } from "~/components/ai/data-stream-provider";

export const experimental_ppr = true;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([getSession(), cookies()]);
  if (!session) {
    redirect("/auth/login");
  }
  const isCollapsed = cookieStore.get("sidebar:state")?.value !== "true";

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <DataStreamProvider>
        <SidebarProvider defaultOpen={!isCollapsed}>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </DataStreamProvider>
    </>
  );
}
