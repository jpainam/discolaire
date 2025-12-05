import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { CircleGauge, FileIcon, FileTextIcon, Settings } from "lucide-react";
import { getTranslations } from "next-intl/server";



import { Skeleton } from "@repo/ui/components/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/components/tabs";



import { GradeReportDashboard } from "~/components/administration/grade-reports/GradeReportDashboard";
import { GradeReportTrackerDataTable } from "~/components/administration/grade-reports/GradeReportTrackerDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { GradeReportSettings } from "../../../../components/administration/grade-reports/GradeReportSettings";


export default async function Page() {
  const t = await getTranslations();
  batchPrefetch([
    trpc.term.all.queryOptions(),
    trpc.gradeSheet.distribution.queryOptions(),
    trpc.gradeSheet.allPercentile.queryOptions(),
    trpc.gradeSheet.gradesReportTracker.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <Tabs defaultValue="dashboard" className="p-2">
        <TabsList>
          <TabsTrigger value="dashboard">
            <CircleGauge />
            {t("dashboard")}
          </TabsTrigger>
          <TabsTrigger value="grades">
            <FileTextIcon /> {t("grades")}
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileIcon /> {t("reports")}
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings /> {t("settings")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={null}>
              <GradeReportDashboard />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="grades">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <Skeleton key={index} className="h-48" />
                  ))}
                </div>
              }
            >
              <GradeReportTrackerDataTable />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="reports">Report</TabsContent>
        <TabsContent value="settings">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-48" />}>
              <GradeReportSettings />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}