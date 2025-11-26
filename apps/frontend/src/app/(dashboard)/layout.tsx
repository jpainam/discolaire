import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SidebarInset, SidebarProvider } from "@repo/ui/components/sidebar";

import { getSession } from "~/auth/server";
import { AppSidebar } from "~/components/app-sidebar";
import GlobalModal from "~/layouts/GlobalModal";
import GlobalSheet from "~/layouts/GlobalSheet";
import { SchoolContextProvider } from "~/providers/SchoolProvider";
import { batchPrefetch, caller, HydrateClient, trpc } from "~/trpc/server";
import { SiteHeader } from "./SideHeader";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarState ? sidebarState.value === "true" : true;

  const schoolYearId = cookieStore.get("x-school-year")?.value ?? null;
  if (!schoolYearId) {
    console.error("No school year selected");
    redirect("/auth/login");
  }

  const [school, schoolYear, permissions] = await Promise.all([
    caller.school.get(session.user.schoolId),
    caller.schoolYear.get(schoolYearId),
    caller.user.getPermissions(session.user.id),
  ]);
  batchPrefetch([trpc.schoolYear.all.queryOptions()]);

  return (
    <SidebarProvider
      style={
        {
          //"--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      defaultOpen={defaultOpen}
    >
      <SchoolContextProvider
        schoolYear={schoolYear}
        school={school}
        permissions={permissions}
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="border">
          <HydrateClient>
            <SiteHeader schoolYearId={schoolYearId} />
          </HydrateClient>
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              {children}
            </div>
          </div>
        </SidebarInset>

        <GlobalSheet />
        <GlobalModal />
      </SchoolContextProvider>
    </SidebarProvider>
  );
}
