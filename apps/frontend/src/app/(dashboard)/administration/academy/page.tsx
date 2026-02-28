import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { BoxIcon, PanelsTopLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createLoader, parseAsString } from "nuqs/server";

import { ErrorFallback } from "~/components/error-fallback";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { CourseCoverageHeader } from "./course_coverage/CourseCoverageHeader";
import { CourseCoveragePieChart } from "./course_coverage/CourseCoveragePieChart";
import { CourseCoverageSummary } from "./course_coverage/CourseCoverageSummary";
import { CourseCoverageTable } from "./course_coverage/CourseCoverageTable";

const academySearchSchema = {
  classroomId: parseAsString,
  teacherId: parseAsString,
  termId: parseAsString,
};
const academySearchParams = createLoader(academySearchSchema);
interface PageProps {
  searchParams: Promise<SearchParams>;
}
export default async function Page(props: PageProps) {
  const searchParams = await academySearchParams(props.searchParams);
  batchPrefetch([
    trpc.term.all.queryOptions(),
    trpc.subjectProgram.all.queryOptions({
      classroomId: searchParams.classroomId,
      teacherId: searchParams.teacherId,
      termId: searchParams.termId,
    }),
  ]);
  const t = await getTranslations();
  return (
    <Tabs defaultValue="tab-1" className="px-4 py-2">
      <TabsList>
        <TabsTrigger value="tab-1">
          <PanelsTopLeftIcon size={16} aria-hidden="true" />
          {t("Coverage")}
        </TabsTrigger>
        <TabsTrigger value="tab-2">
          <BoxIcon size={16} aria-hidden="true" />
          {t("settings")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="tab-1">
        <HydrateClient>
          <div className="grid grid-cols-4 gap-2">
            <div className="col-span-3 flex flex-col gap-4">
              <Suspense fallback={<Skeleton className="h-8" />}>
                <CourseCoverageHeader />
              </Suspense>
              <ErrorBoundary errorComponent={ErrorFallback}>
                <Suspense
                  fallback={
                    <div className="grid grid-cols-4 gap-2">
                      {Array.from({ length: 32 }).map((_, index) => (
                        <Skeleton key={index} className="h-8" />
                      ))}
                    </div>
                  }
                >
                  {/* <CourseCoverageDataTable /> */}
                  <CourseCoverageTable />
                </Suspense>
              </ErrorBoundary>
            </div>
            <div className="pt-4">
              <ErrorBoundary errorComponent={ErrorFallback}>
                <Suspense fallback={<Skeleton className="h-1/6 w-full" />}>
                  <CourseCoverageSummary />
                </Suspense>
              </ErrorBoundary>
              <CourseCoveragePieChart />
            </div>
          </div>
        </HydrateClient>
      </TabsContent>
      <TabsContent value="tab-2">
        <div>Content 2</div>
      </TabsContent>
    </Tabs>
  );
}
