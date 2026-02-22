import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { getSession } from "~/auth/server";
import { AppSidebar } from "~/components/app-sidebar";
import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { ErrorFallback } from "~/components/error-fallback";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { ModalProvider } from "~/hooks/use-modal";
import { SheetProvider } from "~/hooks/use-sheet";
import GlobalModal from "~/layouts/GlobalModal";
import GlobalSheet from "~/layouts/GlobalSheet";
import { SchoolContextProvider } from "~/providers/SchoolProvider";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { Container } from "./Container";
import { RightPanelProvider } from "./RightPanelProvider";
import { SiteHeader } from "./SideHeader";

export const dynamic = "force-dynamic";

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
  const queryClient = getQueryClient();

  const [school, schoolYear, permissions] = await Promise.all([
    queryClient.fetchQuery(trpc.school.get.queryOptions(session.user.schoolId)),
    queryClient.fetchQuery(trpc.schoolYear.get.queryOptions(schoolYearId)),
    queryClient.fetchQuery(
      trpc.user.getPermissions.queryOptions(session.user.id),
    ),
  ]);
  batchPrefetch([trpc.schoolYear.all.queryOptions()]);
  const t = await getTranslations();

  return (
    <SidebarProvider
      className="h-svh"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 58)",
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
        <SheetProvider>
          <ModalProvider>
            <AppSidebar className="p-0" variant="inset" />
            <BreadcrumbsSetter items={[{ label: t("home"), href: "/" }]} />
            <SidebarInset className="border overflow-y-auto">
              <RightPanelProvider>
                <HydrateClient>
                  <ErrorBoundary errorComponent={ErrorFallback}>
                    <Suspense fallback={<Skeleton className="h-12 w-full" />}>
                      <SiteHeader schoolYearId={schoolYearId} />
                    </Suspense>
                  </ErrorBoundary>
                </HydrateClient>
                <Container>{children}</Container>
              </RightPanelProvider>
            </SidebarInset>

            <GlobalSheet />
            <GlobalModal />
          </ModalProvider>
        </SheetProvider>
      </SchoolContextProvider>
    </SidebarProvider>
  );
}
