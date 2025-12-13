import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { getTranslations } from "next-intl/server";

import { GradeDistributionChart } from "~/components/administration/grade-reports/GradeDistributionChart";
import { GradeReportGenerator } from "~/components/administration/grade-reports/GradeReportGenerator";
import { RecentGradesTable } from "~/components/administration/grade-reports/RecentGradesTable";
import { StudentPerformanceChart } from "~/components/administration/grade-reports/StudentPerformanceChart";
import { ErrorFallback } from "~/components/error-fallback";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export async function GradeReportDashboard() {
  const t = await getTranslations();
  return (
    <div className="flex flex-col gap-2">
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("Recent Grades")}</CardTitle>
            <CardDescription className="text-xs">
              {t("Latest grades entered into the system")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense
              fallback={
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                  {Array.from({ length: 16 }).map((_, index) => (
                    <Skeleton className="h-8" key={index} />
                  ))}
                </div>
              }
            >
              <RecentGradesTable />
            </Suspense>
          </CardContent>
        </Card>
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
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
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
      <GradeReportGenerator />
    </div>
  );
}
