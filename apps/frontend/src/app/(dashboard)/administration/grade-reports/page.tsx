import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { AnalysisTextLinkIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BetweenHorizontalStart,
  CircleGauge,
  FileIcon,
  FileTextIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createLoader, parseAsString } from "nuqs/server";

import { GradeReportDashboard } from "~/components/administration/grade-reports/GradeReportDashboard";
import { GradeReportGenerator } from "~/components/administration/grade-reports/GradeReportGenerator";
import { GradeReportPublicationDates } from "~/components/administration/grade-reports/GradeReportPublicationDates";
import { GradeReportTrackerDataTable } from "~/components/administration/grade-reports/GradeReportTrackerDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

const gradeReportSearchSchema = {
  tabId: parseAsString,
};
interface PageProps {
  searchParams: Promise<SearchParams>;
}
const gradeReportSchema = createLoader(gradeReportSearchSchema);
export default async function Page(props: PageProps) {
  const t = await getTranslations();
  const searchParams = await gradeReportSchema(props.searchParams);
  batchPrefetch([
    trpc.term.all.queryOptions(),
    trpc.gradeSheet.distribution.queryOptions(),
    trpc.gradeSheet.allPercentile.queryOptions(),
    trpc.gradeSheet.gradesReportTracker.queryOptions(),
  ]);

  return (
    <HydrateClient>
      <Tabs defaultValue={searchParams.tabId ?? "dashboard"} className="p-2">
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
          <TabsTrigger value="distributions">
            <HugeiconsIcon icon={AnalysisTextLinkIcon} /> {t("Distributions")}
          </TabsTrigger>
          <TabsTrigger value="publications">
            <BetweenHorizontalStart /> Publications
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
        <TabsContent value="reports">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-48 w-full" />}>
              <GradeReportGenerator limited={false} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="distributions">Distributions</TabsContent>
        <TabsContent value="publications">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-48" />}>
              <GradeReportPublicationDates />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
