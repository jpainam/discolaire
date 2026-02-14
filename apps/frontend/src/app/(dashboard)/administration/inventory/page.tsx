import { Suspense } from "react";
import { ErrorBoundary } from "next/dist/client/components/error-boundary";
import {
  ChartLine,
  HouseIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { InventorySettings } from "~/components/administration/inventory/InventorySettings";
import { ConsumeEventDataTable } from "~/components/administration/inventory/movements/ConsumeEventDataTable";
import { StockMovementHeader } from "~/components/administration/inventory/movements/StockMovementHeader";
import { ErrorFallback } from "~/components/error-fallback";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  batchPrefetch,
  getQueryClient,
  HydrateClient,
  trpc,
} from "~/trpc/server";
import { InventorySummary } from "./InventorySummary";
import { InventoryTable } from "./InventoryTable";

export default async function Page() {
  const queryClient = getQueryClient();
  const items = await queryClient.fetchQuery(trpc.inventory.all.queryOptions());
  //const items = await fetchQtrpc.inventory.all;
  batchPrefetch([
    trpc.inventory.all.queryOptions(),
    trpc.inventory.events.queryOptions(),
    trpc.inventory.consumables.queryOptions(),
  ]);
  const t = await getTranslations();
  return (
    <HydrateClient>
      <Tabs defaultValue="tab-1" className="px-4 py-2">
        <TabsList>
          <TabsTrigger value="tab-1">
            <HouseIcon size={16} aria-hidden="true" />
            {t("dashboard")}
          </TabsTrigger>
          <TabsTrigger value="tab-2">
            <PanelsTopLeftIcon size={16} aria-hidden="true" />
            {t("Articles")}
            <Badge variant="secondary">{items.length}</Badge>
          </TabsTrigger>

          <TabsTrigger value="tab-3">
            <ChartLine size={16} aria-hidden="true" />
            Emprunt
          </TabsTrigger>
          <TabsTrigger value="tab-4">
            <SettingsIcon size={16} aria-hidden="true" />
            {t("settings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tab-1">
          {/* <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 1
        </p>
         */}
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-20" />
                  ))}
                </div>
              }
            >
              <InventorySummary />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        <TabsContent value="tab-2">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-3 gap-4">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-8" />
                  ))}
                </div>
              }
            >
              <InventoryTable />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>
        {/* Movement de tock */}
        <TabsContent value="tab-3">
          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense
              fallback={
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                  <Skeleton className="h-8" />
                </div>
              }
            >
              <StockMovementHeader />
            </Suspense>
          </ErrorBoundary>
          <Separator />

          <ErrorBoundary errorComponent={ErrorFallback}>
            <Suspense fallback={<Skeleton className="h-[500px]" />}>
              <ConsumeEventDataTable />
            </Suspense>
          </ErrorBoundary>
        </TabsContent>

        <TabsContent value="tab-4">
          <InventorySettings />
        </TabsContent>
      </Tabs>
    </HydrateClient>
  );
}
