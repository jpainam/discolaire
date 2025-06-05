import type { Metadata } from "next";

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
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { Suspense } from "react";
import { GradeDistributionChart } from "~/components/administration/grade-reports/GradeDistributionChart";
import { GradeDistributionBySubject } from "~/components/administration/grade-reports/GradeDistributionChartBySubject";
import { GradeReportGenerator } from "~/components/administration/grade-reports/GradeReportGenerator";
import { GradeReportGenerator2 } from "~/components/administration/grade-reports/GradeReportGenerator2";
import { RecentGradesTable } from "~/components/administration/grade-reports/RecentGradesTable";
import { StudentPerformanceChart } from "~/components/administration/grade-reports/StudentPerformanceChart";
import { StudentPerformanceChart2 } from "~/components/administration/grade-reports/StudentPerformanceChart2";
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
  ]);
  return (
    <HydrateClient>
      <div className="px-4 py-2">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">{t("dashboard")}</TabsTrigger>
            {/* <TabsTrigger value="grades">{t("grades")}</TabsTrigger> */}
            <TabsTrigger value="reports">{t("reports")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("charts")}</TabsTrigger>
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
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>{t("Grade Report Generator")}</CardTitle>
                  <CardDescription className="text-xs">
                    {t("Generate and download grade reports")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary errorComponent={ErrorFallback}>
                    <Suspense fallback={<Skeleton className="h-48" />}>
                      <GradeReportGenerator />
                    </Suspense>
                  </ErrorBoundary>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          {/* <TabsContent value="grades" className="space-y-4">
            <ErrorBoundary errorComponent={ErrorFallback}>
              <Suspense
                fallback={
                  <div className="grid grid-cols-3 gap-4">
                    {Array.from({ length: 12 }).map((_, index) => (
                      <Skeleton key={index} className="h-48 " />
                    ))}
                  </div>
                }
              >
                <GradeSheetDataTable />
              </Suspense>
            </ErrorBoundary>
          </TabsContent> */}
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Grade Reports</CardTitle>
                <CardDescription>
                  Generate and manage grade reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GradeReportGenerator2 expanded={true} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Grade Analytics</CardTitle>
                <CardDescription>
                  In-depth analysis of grade data
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-sm font-medium">
                    Grade Distribution by Subject
                  </h3>
                  <GradeDistributionBySubject />
                </div>
                <div>
                  <h3 className="mb-4 text-sm font-medium">
                    Performance Trends
                  </h3>
                  <div className="h-[300px]">
                    <StudentPerformanceChart2 extended={true} />
                  </div>
                </div>
              </CardContent>
            </Card>
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
