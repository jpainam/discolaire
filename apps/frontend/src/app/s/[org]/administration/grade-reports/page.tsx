import type { Metadata } from "next";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { GradeDistributionChart } from "~/components/administration/grade-reports/GradeDistributionChart";
import { GradeReportGenerator } from "~/components/administration/grade-reports/GradeReportGenerator";
import { GradeReportTrackerDataTable } from "~/components/administration/grade-reports/GradeReportTrackerDataTable";
import { RecentGradesTable } from "~/components/administration/grade-reports/RecentGradesTable";
import { StudentPerformanceChart } from "~/components/administration/grade-reports/StudentPerformanceChart";
import { ErrorFallback } from "~/components/error-fallback";
import { getServerTranslations } from "~/i18n/server";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { GradeReportSettings } from "./settings/GradeReportSettings";

export const metadata: Metadata = {
  title: "Grades Management Dashboard",
  description:
    "A comprehensive dashboard for managing and analyzing student grades",
};

export default async function Page() {
  const { t } = await getServerTranslations();
  batchPrefetch([
    //trpc.gradeSheet.all.queryOptions(),
    trpc.term.all.queryOptions(),
    trpc.gradeSheet.distribution.queryOptions(),
    trpc.gradeSheet.allPercentile.queryOptions(),
    trpc.gradeSheet.gradesReportTracker.queryOptions(),
  ]);
  return (
    <HydrateClient>
      <div className="px-4 py-2">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">{t("dashboard")}</TabsTrigger>
            <TabsTrigger value="grades">{t("grades")}</TabsTrigger>
            <TabsTrigger value="reports">{t("reports")}</TabsTrigger>

            <TabsTrigger value="settings">{t("settings")}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>{t("Grade Distribution")}</CardTitle>
                  <CardDescription className="text-xs">
                    {t("Distribution of grades across all students")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ErrorBoundary errorComponent={ErrorFallback}>
                    <Suspense fallback={<Skeleton className="h-48" />}>
                      <GradeDistributionChart />
                    </Suspense>
                  </ErrorBoundary>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>{t("Recent Grades")}</CardTitle>
                  <CardDescription className="text-xs">
                    {t("Latest grades entered into the system")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentGradesTable />
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>{t("Student Performance")}</CardTitle>
                  <CardDescription className="text-xs">
                    {t("Comparison of student performance over time")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-0">
                  <ErrorBoundary errorComponent={ErrorFallback}>
                    <Suspense fallback={<Skeleton className="h-48" />}>
                      <StudentPerformanceChart />
                    </Suspense>
                  </ErrorBoundary>
                </CardContent>
              </Card>
              <GradeReportGenerator />
            </div>
          </TabsContent>
          <TabsContent value="grades" className="space-y-4">
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
          <TabsContent value="reports">
            <GradeReportGenerator />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense fallback={<Skeleton className="h-48" />}>
                <GradeReportSettings />
              </Suspense>
            </ErrorBoundary>
          </TabsContent>
        </Tabs>
      </div>
    </HydrateClient>
  );
}
