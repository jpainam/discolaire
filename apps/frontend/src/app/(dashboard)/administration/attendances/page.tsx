import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { AttendanceChart } from "./AttendanceChart";
import { AttendanceDataTable } from "./AttendanceDataTable";
import { AttendanceStats } from "./AttendanceStats";

export default async function Page() {
  const t = await getTranslations();
  batchPrefetch([
    trpc.attendance.all.queryOptions({}),
    trpc.attendance.chart.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <Tabs defaultValue="tab-1" className="w-full px-4 py-2">
        <TabsList>
          <TabsList className="gap-1 bg-transparent">
            <TabsTrigger value="tab-1">{t("dashboard")}</TabsTrigger>
            <TabsTrigger value="tab-3">{t("students")}</TabsTrigger>
            <TabsTrigger value="tab-4">{t("notifications")}</TabsTrigger>
            <TabsTrigger value="tab-5">{t("settings")}</TabsTrigger>
          </TabsList>
        </TabsList>
        <TabsContent value="tab-1">
          <div className="flex flex-col gap-4">
            <AttendanceStats />
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="gap2 grid grid-cols-4">
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                    <Skeleton className="h-20" />
                  </div>
                }
              >
                <AttendanceChart />
              </Suspense>
            </ErrorBoundary>
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: 8 }).map((_, index) => {
                      return <Skeleton key={index} className="h-8" />;
                    })}
                  </div>
                }
              >
                <AttendanceDataTable />
              </Suspense>
            </ErrorBoundary>
          </div>
        </TabsContent>
        <TabsContent value="tab-2"></TabsContent>
        <TabsContent value="tab-3">
          <p className="text-muted-foreground p-4 text-center text-xs">
            Content for Tab 3
          </p>
        </TabsContent>
        <TabsContent value="tab-4">
          <p className="text-muted-foreground p-4 text-center text-xs">
            Content for Tab 3
          </p>
        </TabsContent>
        <TabsContent value="tab-5">
          <p className="text-muted-foreground p-4 text-center text-xs">
            Content for Tab 3
          </p>
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
