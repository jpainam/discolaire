import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@repo/auth";
import { Separator } from "@repo/ui/components/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@repo/ui/components/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { ModeToggle } from "~/components/mode-toggle";
import { UserNav } from "~/components/user-nav";

import { SchoolContextProvider } from "~/providers/SchoolProvider";

import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { SchoolYearSwitcher } from "~/components/SchoolYearSwitcher";
import { TopRightButtons } from "~/components/TopRightButtons";
import GlobalModal from "~/layouts/GlobalModal";
import GlobalSheet from "~/layouts/GlobalSheet";
import { api } from "~/trpc/server";
import { Breadcrumbs } from "~/components/breadcrumbs";

export default async function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session) {
    redirect("/auth/login");
  }
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const school = await api.school.get(session.user.schoolId);
  const schoolYearId = cookieStore.get("schoolYear")?.value;
  if (!schoolYearId) {
    throw new Error("No school year selected");
  }
  const schoolYear = await api.schoolYear.get(schoolYearId);
  const permissions = await api.user.permissions();
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
              <div className="ml-auto flex items-center gap-2">
                <SchoolYearSwitcher defaultValue={schoolYear.id} />
                <TopRightButtons />
                <ModeToggle />
                <LanguageSwitcher />
                <UserNav />
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
