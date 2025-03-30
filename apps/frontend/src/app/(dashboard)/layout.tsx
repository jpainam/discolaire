import { auth } from "@repo/auth";
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

import { Breadcrumbs } from "~/components/breadcrumbs";
import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { SchoolYearSwitcher } from "~/components/SchoolYearSwitcher";
import { Shortcut } from "~/components/Shortcut";
import { ThemeSelector } from "~/components/theme-selector";
import { TopRightButtons } from "~/components/TopRightButtons";
import GlobalModal from "~/layouts/GlobalModal";
import GlobalSheet from "~/layouts/GlobalSheet";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const cookieStore = await cookies();
  const sidebarState = cookieStore.get("sidebar_state");
  const defaultOpen = sidebarState ? sidebarState.value === "true" : true;

  const schoolYearId = cookieStore.get("schoolYear")?.value;
  if (!schoolYearId) {
    console.error("No school year selected");
    redirect("/auth/login");
  }
  //prefetch(api.classroom.all.queryOptions());
  const [school, schoolYear, schoolYears, permissions] = await Promise.all([
    api.school.get(session.user.schoolId),
    api.schoolYear.get(schoolYearId),
    api.schoolYear.all(),
    api.user.getPermissions(session.user.id),
  ]);

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
          <header className="bg-background sticky inset-x-0 top-0 isolate z-10 flex shrink-0 items-center gap-2 border-b">
            <div className="flex h-14 w-full items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1.5" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              {/* <NavHeader /> */}
              <Breadcrumbs />
              <div className="ml-auto flex items-center gap-4">
                <SchoolYearSwitcher
                  schoolYears={schoolYears}
                  defaultValue={schoolYear.id}
                />
                <ThemeSelector />
                <div className="hidden md:flex items-center gap-2">
                  <TopRightButtons />
                  <Shortcut />
                  <ModeSwitcher />
                  <LanguageSwitcher />
                  <UserNav />
                </div>
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
