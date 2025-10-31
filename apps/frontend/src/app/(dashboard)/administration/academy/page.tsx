import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import { BoxIcon, PanelsTopLeftIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { createLoader, parseAsString } from "nuqs/server";

import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { ErrorFallback } from "~/components/error-fallback";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { CourseCoverageHeader } from "./course_coverage/CourseCoverageHeader";
import { CourseCoveragePieChart } from "./course_coverage/CourseCoveragePieChart";
import { CourseCoverageSummary } from "./course_coverage/CourseCoverageSummary";
import { CourseCoverageTable } from "./course_coverage/CourseCoverageTable";
import { ProgramCategoryTable } from "./ProgramCategoryTable";

const academySearchSchema = {
  classroomId: parseAsString.withDefault(""),
  staffId: parseAsString.withDefault(""),
  categoryId: parseAsString.withDefault(""),
};
const academySearchParams = createLoader(academySearchSchema);
interface PageProps {
  searchParams: Promise<SearchParams>;
}
export default async function Page(props: PageProps) {
  const searchParams = await academySearchParams(props.searchParams);
  batchPrefetch([
    trpc.program.categories.queryOptions(),
    trpc.subject.programs.queryOptions({
      classroomId: searchParams.classroomId,
      staffId: searchParams.staffId,
      categoryId: searchParams.categoryId,
    }),
  ]);
  const t = await getTranslations();
  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="bg-background h-auto -space-x-px p-0 shadow-xs rtl:space-x-reverse">
          {/* <TabsTrigger
            value="tab-1"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <HouseIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("academy")}
          </TabsTrigger> */}
          <TabsTrigger
            value="tab-1"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative w-fit overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <PanelsTopLeftIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("Coverage")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <BoxIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("settings")}
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {/* <TabsContent value="tab-1" className="gap-0 p-0">
        <div className="flex flex-col px-4">
          <AcademyStatCard />
          <CourseCoverageOverview />
        </div>
      </TabsContent> */}
      <TabsContent value="tab-1">
        <HydrateClient>
          <div className="grid grid-cols-4 gap-2 px-4">
            <div className="col-span-3 flex flex-col gap-2">
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
        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<div>Loading...</div>}>
              <ProgramCategoryTable />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </TabsContent>
    </Tabs>
  );
}
