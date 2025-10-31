import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  BoxIcon,
  HouseIcon,
  LayoutPanelTopIcon,
  PanelsTopLeftIcon,
} from "lucide-react";

import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import { Skeleton } from "@repo/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { ClassroomLevelChart } from "~/components/administration/classrooms/ClassroomLevelChart";
import { ClassroomLevelEffectif } from "~/components/administration/classrooms/ClassroomLevelEffectif";
import { ClassroomLevelHeader } from "~/components/administration/classrooms/ClassroomLevelHeader";
import { ClassroomLevelTable } from "~/components/administration/classrooms/ClassroomLevelTable";
import { ClassroomDataTable } from "~/components/classrooms/ClassroomDataTable";
import { ErrorFallback } from "~/components/error-fallback";
import { getServerTranslations } from "~/i18n/server";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { CycleHeader } from "./cycles/CycleHeader";
import { CycleTable } from "./cycles/CycleTable";
import { SectionHeader } from "./sections/SectionHeader";
import { SectionTable } from "./sections/SectionTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  void prefetch(trpc.classroom.all.queryOptions());
  return (
    <Tabs defaultValue="tab-1" className="pt-2">
      <ScrollArea>
        <TabsList className="bg-background h-auto w-full justify-start -space-x-px p-0 shadow-xs rtl:space-x-reverse">
          <TabsTrigger
            value="tab-1"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <HouseIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("classrooms")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <PanelsTopLeftIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("cycles")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <BoxIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("levels")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-4"
            className="data-[state=active]:bg-muted data-[state=active]:after:bg-primary relative overflow-hidden rounded-none border py-2 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 first:rounded-s last:rounded-e"
          >
            <LayoutPanelTopIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("sections")}
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        <HydrateClient>
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              key={"classroom-table"}
              fallback={
                <div className="grid grid-cols-4 gap-4 p-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
              }
            >
              <ClassroomDataTable />
            </Suspense>
          </ErrorBoundary>
        </HydrateClient>
      </TabsContent>
      <TabsContent value="tab-2">
        <div className="flex flex-col gap-2 px-4">
          <CycleHeader />
          <CycleTable />
        </div>
      </TabsContent>
      <TabsContent value="tab-3">
        <div className="grid grid-cols-1 items-start gap-2 xl:grid-cols-2">
          <ClassroomLevelHeader />
          <ClassroomLevelTable />
          <div className="flex flex-col gap-2">
            <ClassroomLevelChart />
            <ClassroomLevelEffectif />
          </div>
        </div>
      </TabsContent>
      <TabsContent value="tab-4">
        <div className="flex flex-col gap-2 px-4">
          <SectionHeader />
          <SectionTable />
        </div>
      </TabsContent>
    </Tabs>
  );
}
