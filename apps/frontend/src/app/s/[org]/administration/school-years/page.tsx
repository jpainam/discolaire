import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  Calendar,
  CalendarDays,
  Loader2,
  PanelsTopLeftIcon,
} from "lucide-react";

import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
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
import { batchPrefetch, HydrateClient, trpc } from "~/trpc/server";
import { SchoolYearCalendar } from "./calendar/SchoolYearCalendar";
import { SchoolYearCalendarProvider } from "./calendar/SchoolYearCalendarContext";
import { TermHeader } from "./terms/TermHeader";
import { TermTable } from "./terms/TermTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  batchPrefetch([
    trpc.schoolYearEvent.all.queryOptions(),
    trpc.schoolYearEvent.eventTypes.queryOptions(),
  ]);

  return (
    <Tabs defaultValue="tab-1" className="pt-2">
      <ScrollArea>
        <TabsList className="before:bg-border relative h-auto w-full justify-start gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
          <TabsTrigger
            value="tab-1"
            className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <CalendarDays
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("calendar")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <PanelsTopLeftIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("terms")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Calendar
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("schoolYear")}
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="my10 flex items-center justify-center">
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
    </Tabs>
  );
}
