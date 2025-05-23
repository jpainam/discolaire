import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Calendar, CalendarDays, PanelsTopLeftIcon } from "lucide-react";
import { SchoolYearHeader } from "~/components/schoolyears/SchoolYearHeader";
import { SchoolYearTable } from "~/components/schoolyears/SchoolYearTable";
import { getServerTranslations } from "~/i18n/server";
import { SchoolYearCalendar } from "./calendar/SchoolYearCalendar";
import { TermHeader } from "./terms/TermHeader";
import { TermTable } from "./terms/TermTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <Tabs defaultValue="tab-1" className="pt-2">
      <ScrollArea>
        <TabsList className="before:bg-border w-full justify-start relative  h-auto  gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
          <TabsTrigger
            value="tab-1"
            className="data-[state=active]:bg-transparent bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
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
            className="data-[state=active]:bg-transparent bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
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
            className="data-[state=active]:bg-transparent bg-muted overflow-hidden rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
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
        <SchoolYearCalendar />
      </TabsContent>
      <TabsContent value="tab-2">
        <div className="flex flex-col gap-2">
          <TermHeader />
          <TermTable />
        </div>
      </TabsContent>
      <TabsContent value="tab-3">
        <div className="flex flex-col gap-2 ">
          <div className="ml-auto px-4">
            <SchoolYearHeader />
          </div>
          <SchoolYearTable />
        </div>
      </TabsContent>
    </Tabs>
  );
}
