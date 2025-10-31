import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { Separator } from "@repo/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar";
import { Skeleton } from "@repo/ui/components/skeleton";

import { getSession } from "~/auth/server";
import { AppSidebar } from "~/components/app-sidebar";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import NotificationMenu from "~/components/notifications/NotificationMenu";
import { SchoolYearSwitcher } from "~/components/SchoolYearSwitcher";
import { Shortcut } from "~/components/shortcuts/Shortcut";
import { ThemeSelector } from "~/components/ThemeSelector";
import { TopRightButtons } from "~/components/TopRightButtons";
import { UserNav } from "~/components/user-nav";
import GlobalModal from "~/layouts/GlobalModal";
import GlobalSheet from "~/layouts/GlobalSheet";
import { SchoolContextProvider } from "~/providers/SchoolProvider";
import { batchPrefetch, caller, HydrateClient, trpc } from "~/trpc/server";

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
      // style={{
      //   // @ts-expect-error Ignore
      //   "--sidebar-width": "14rem",
      //   "--sidebar-width-mobile": "16rem",
      // }}
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12 + 1px)",
        } as React.CSSProperties
      }
      defaultOpen={defaultOpen}
    >
      <SchoolContextProvider
        schoolYear={schoolYear}
        school={school}
        permissions={permissions}
      >
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky inset-x-0 top-0 isolate z-20 flex shrink-0 items-center gap-2 border-b">
            <div className="flex w-full items-center gap-2 px-4 py-2">
              <SidebarTrigger className="-ml-1.5" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {/* <NavHeader /> */}
              <Breadcrumbs />
              <div className="ml-auto flex items-center gap-1">
                <HydrateClient>
                  <Suspense fallback={<Skeleton className="w-10" />}>
                    <SchoolYearSwitcher defaultValue={schoolYearId} />
                  </Suspense>
                </HydrateClient>
                <ThemeSelector />
                <Separator
                  orientation="vertical"
                  className="ml-1 hidden w-px data-[orientation=vertical]:h-6 md:block"
                />
                <TopRightButtons />
                <Separator
                  orientation="vertical"
                  className="hidden w-px data-[orientation=vertical]:h-6 md:block"
                />
                <Shortcut className="hidden md:flex" />
                <ModeSwitcher />
                <LanguageSwitcher className="hidden md:flex" />
                <Separator
                  orientation="vertical"
                  className="mr-1 hidden w-px data-[orientation=vertical]:h-6 md:block"
                />
                <NotificationMenu userId={session.user.id} />
                <UserNav className={"hidden md:block"} />
              </div>
            </div>
          </header>
          {/* <DashaboardLayout /> */}
          {children}
        </SidebarInset>
        <GlobalSheet />
        <GlobalModal />
      </SchoolContextProvider>
    </SidebarProvider>
  );
}
