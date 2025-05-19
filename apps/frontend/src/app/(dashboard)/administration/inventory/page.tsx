import {
  ChartLine,
  HouseIcon,
  PanelsTopLeftIcon,
  SettingsIcon,
} from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import { ScrollArea, ScrollBar } from "@repo/ui/components/scroll-area";
import { Separator } from "@repo/ui/components/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { ConsumableUsageDataTable } from "~/components/administration/inventory/movements/ConsumableUsageDataTable";
import { ConsumableUsageHeader } from "~/components/administration/inventory/movements/ConsumableUsageHeader";
import { getServerTranslations } from "~/i18n/server";
import { batchPrefetch, getQueryClient, trpc } from "~/trpc/server";
import { InventoryDataTable } from "./InventoryDataTable";
import { InventoryHeader } from "./InventoryHeader";
import { InventorySummary } from "./InventorySummary";

export default async function Page() {
  const queryClient = getQueryClient();
  const items = await queryClient.fetchQuery(trpc.inventory.all.queryOptions());
  //const items = await fetchQtrpc.inventory.all;
  batchPrefetch([
    trpc.inventory.all.queryOptions(),
    trpc.inventory.consumableUsages.queryOptions(),
    trpc.inventory.consumables.queryOptions(),
  ]);
  const { t } = await getServerTranslations();
  return (
    <Tabs defaultValue="tab-2">
      <ScrollArea>
        <TabsList className="w-full text-foreground h-auto gap-2 rounded-none border-b bg-transparent px-0 py-1">
          <TabsTrigger
            value="tab-1"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <HouseIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("dashboard")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-2"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <PanelsTopLeftIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("inventory")}
            <Badge
              className="bg-primary/15 ms-1.5 min-w-5 px-1"
              variant="secondary"
            >
              {items.length}
            </Badge>
          </TabsTrigger>

          <TabsTrigger
            value="tab-3"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <ChartLine
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("Stock movement")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-4"
            className="hover:bg-accent hover:text-foreground data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <SettingsIcon
              className="-ms-0.5 me-1.5 opacity-60"
              size={16}
              aria-hidden="true"
            />
            {t("settings")}
          </TabsTrigger>
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <TabsContent value="tab-1">
        {/* <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 1
        </p>
         */}

        <InventorySummary />
      </TabsContent>
      <TabsContent className="px-4" value="tab-2">
        <InventoryHeader />
        <InventoryDataTable />
      </TabsContent>
      <TabsContent value="tab-3" className=" gap-1 flex flex-col">
        <ConsumableUsageHeader />
        <Separator />
        <div className="px-4">
          <ConsumableUsageDataTable />
        </div>
      </TabsContent>

      <TabsContent value="tab-4">
        <p className="text-muted-foreground pt-1 text-center text-xs">
          Content for Tab 6
        </p>
      </TabsContent>
    </Tabs>
  );
}
