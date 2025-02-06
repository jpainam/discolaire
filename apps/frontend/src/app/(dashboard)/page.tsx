import { getServerTranslations } from "@repo/i18n/server";
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/tooltip";

import { DashboardClassroomSize } from "~/components/dashboard/DashboardClassroomSize";
import { DashboardTransactionTrend } from "~/components/dashboard/DashboardTransactionTrend";
import { EducationalRessource } from "~/components/dashboard/EducationalRessource";
import { QuickStatistics } from "~/components/dashboard/QuickStatistics";
import { ScheduleCard } from "~/components/dashboard/ScheduleCard";
import { SchoolLife } from "~/components/dashboard/SchoolLife";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="grid grid-cols-1 gap-4 px-4 md:pt-[110px] 2xl:grid-cols-12">
      <div className="col-span-full text-lg font-bold md:text-2xl">
        {t("dashboard")}
      </div>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm">
              W/ arrow
            </Button>
          </TooltipTrigger>
          <TooltipContent className="dark px-2 py-1 text-xs" showArrow={true}>
            This tooltip has an arrow
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <div className="space-y-2">
        <Label htmlFor={"aa"}>Simple input</Label>
        <Input id={"aa"} placeholder="Email" type="email" />
      </div>
      <QuickStatistics />
      {/* <SearchBlock className="col-span-full md:col-span-6" /> */}
      <SchoolLife />
      <ScheduleCard />
      <EducationalRessource />
      {/* <Suspense>
        <EffectiveStat className="col-span-full" />
      </Suspense> */}
      {/*<ContactCard className="col-span-4" /> */}

      {/* <Suspense>
        <TransactionStat className="col-span-full" />
      </Suspense> */}
      <DashboardClassroomSize className="col-span-full hidden md:block" />
      <DashboardTransactionTrend className="col-span-full hidden md:block" />
      {/*
        <ClassroomEffectiveStats className="text-sm col-span-8" />
        <GenderStats className="col-span-4" /> */}
    </div>
  );
}
{
  /* <div className="grid grid-cols-12 gap-6 @container @[59rem]:gap-7">
      <JobStats className="col-span-full" /> */
}
