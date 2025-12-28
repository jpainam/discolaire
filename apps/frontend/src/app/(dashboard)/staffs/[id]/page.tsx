import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  BookOpenCheck,
  CalendarDays,
  CircleDollarSign,
  Folders,
  History,
  KeySquare,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { ErrorFallback } from "~/components/error-fallback";
import { TableSkeleton } from "~/components/skeletons/table-skeleton";
import { StaffTeachingTable } from "~/components/staffs/StaffTeachingTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { GradeIcon } from "~/icons";
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const t = await getTranslations();
  batchPrefetch([trpc.staff.teachings.queryOptions(params.id)]);
  return (
    <HydrateClient>
      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">
            <History className="h-4 w-4" />
            {t("timeline")}
          </TabsTrigger>
          <TabsTrigger value="permissions">
            <KeySquare className="h-4 w-4" />
            {t("permissions")}
          </TabsTrigger>
          <TabsTrigger value="teachings">
            <BookOpenCheck />
            {t("teachings")}
          </TabsTrigger>
          <TabsTrigger value="timetables">
            <CalendarDays /> {t("timetables")}
          </TabsTrigger>
          <TabsTrigger value="grades">
            <GradeIcon />
            {t("grades")}
          </TabsTrigger>
          <TabsTrigger value="payroll">
            <CircleDollarSign className="h-4 w-4" /> {t("payroll")}
          </TabsTrigger>
          <TabsTrigger value="documents">
            <Folders className="h-4 w-4" /> {t("documents")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="timeline">timeline</TabsContent>
        <TabsContent value="permissions">permissions</TabsContent>
        <TabsContent value="teachings">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<TableSkeleton rows={3} cols={4} />}>
              <StaffTeachingTable staffId={params.id} />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="timetables">timetables</TabsContent>
        <TabsContent value="grades">grades</TabsContent>
        <TabsContent value="payroll">payroll</TabsContent>
        <TabsContent value="documents">documents</TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
