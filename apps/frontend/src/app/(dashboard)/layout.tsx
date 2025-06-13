import { Separator } from "@repo/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppSidebar } from "~/components/app-sidebar";
import { ModeSwitcher } from "~/components/mode-switcher";
import { UserNav } from "~/components/user-nav";
import { SchoolContextProvider } from "~/providers/SchoolProvider";

import { Skeleton } from "@repo/ui/components/skeleton";
import { Suspense } from "react";
import { getSession } from "~/auth/server";
import { Breadcrumbs } from "~/components/breadcrumbs";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { SchoolYearSwitcher } from "~/components/SchoolYearSwitcher";
import { Shortcut } from "~/components/Shortcut";
import { ThemeSelector } from "~/components/ThemeSelector";
import { TopRightButtons } from "~/components/TopRightButtons";
import GlobalModal from "~/layouts/GlobalModal";
import GlobalSheet from "~/layouts/GlobalSheet";
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
      style={{
        // @ts-expect-error Ignore
        "--sidebar-width": "14rem",
        "--sidebar-width-mobile": "16rem",
      }}
      defaultOpen={defaultOpen}
    >
      <SchoolContextProvider
        schoolYear={schoolYear}
        school={school}
        permissions={permissions}
      >
        {/* <NoticeBanner /> */}
        <AppSidebar />
        <SidebarInset>
          <header className="bg-background sticky inset-x-0 top-0 isolate z-20 flex shrink-0 items-center gap-2 border-b">
            <div className="flex py-2 w-full items-center gap-2 px-4">
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
                  className="hidden md:block ml-1 w-px data-[orientation=vertical]:h-6"
                />
                <TopRightButtons />
                <Separator
                  orientation="vertical"
                  className="hidden md:block w-px data-[orientation=vertical]:h-6"
                />
                <Shortcut className="hidden md:flex" />
                <ModeSwitcher />
                <LanguageSwitcher />
                <Separator
                  orientation="vertical"
                  className="hidden md:block mr-1 w-px data-[orientation=vertical]:h-6"
                />
                <UserNav className={"hidden md:block"} />
              </div>
            </div>
          </header>
          {children}
        </SidebarInset>
        <GlobalSheet />
        <GlobalModal />
      </SchoolContextProvider>
    </SidebarProvider>
  );
}
