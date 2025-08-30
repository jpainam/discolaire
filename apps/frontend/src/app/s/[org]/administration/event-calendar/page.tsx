import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  Calendar1Icon,
  CalendarDays,
  Loader2,
  PanelsTopLeftIcon,
  TableRowsSplit,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { ErrorFallback } from "~/components/error-fallback";
import { SchoolYearHeader } from "~/components/schoolyears/SchoolYearHeader";
import { SchoolYearTable } from "~/components/schoolyears/SchoolYearTable";
import { getServerTranslations } from "~/i18n/server";
import { batchPrefetch, caller, HydrateClient, trpc } from "~/trpc/server";
import { SchoolYearCalendar } from "./calendar/SchoolYearCalendar";
import { SchoolYearCalendarProvider } from "./calendar/SchoolYearCalendarContext";
import { ScheduleDivision } from "./schedule-division/ScheduleDivision";
import { TermHeader } from "./terms/TermHeader";
import { TermTable } from "./terms/TermTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  const terms = await caller.term.all();

  batchPrefetch([
    trpc.schoolYearEvent.all.queryOptions(),
    trpc.schoolYearEvent.eventTypes.queryOptions(),
  ]);

  return (
    <Tabs defaultValue="tab-1">
      <ScrollArea>
        <TabsList className="">
          <TabsTrigger value="tab-1">
            <CalendarDays
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("calendar")}
          </TabsTrigger>
          <TabsTrigger value="tab-2" className="group">
            <PanelsTopLeftIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("terms")}
            <Badge
              className="bg-primary/15 ms-1.5 min-w-5 px-1 transition-opacity group-data-[state=inactive]:opacity-50"
              variant="secondary"
            >
              {terms.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="tab-3" className="group">
            <Calendar1Icon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("schoolYear")}
            {/* <Badge className="ms-1.5 transition-opacity group-data-[state=inactive]:opacity-50">
              New
            </Badge> */}
          </TabsTrigger>
          <TabsTrigger value="tab-4" className="group">
            <TableRowsSplit
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("Schedule division")}
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="my-10 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              }
            >
              <SchoolYearCalendarProvider>
                <SchoolYearCalendar />
              </SchoolYearCalendarProvider>
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </TabsContent>
      <TabsContent value="tab-2">
        <div className="flex flex-col gap-2">
          <TermHeader />
          <TermTable />
        </div>
      </TabsContent>
      <TabsContent value="tab-3">
        <div className="flex flex-col gap-2">
          <div className="ml-auto px-4">
            <SchoolYearHeader />
          </div>
          <SchoolYearTable />
        </div>
      </TabsContent>
      <TabsContent value="tab-4">
        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="my-10 p-4">
                  <Skeleton className="h-1/2 w-1/2" />
                </div>
              }
            >
              <ScheduleDivision />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </TabsContent>
    </Tabs>
  );
}
