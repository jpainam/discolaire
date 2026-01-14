import type { SearchParams } from "nuqs/server";
import { MoneyExchange01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";
import { createLoader, parseAsString } from "nuqs/server";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { caller } from "~/trpc/server";
import { CanReceiveTransactionSummary } from "./CanReceiveTransactionSummary";
import { ConfigurationRH } from "./ConfigurationRH";
import { AccountingJournal } from "./journal/AccountingJournal";

interface PageProps {
  searchParams: Promise<SearchParams>;
}
const searchSchema = {
  tabId: parseAsString,
};
const searchParamsLoader = createLoader(searchSchema);
export default async function Page(props: PageProps) {
  const searchParams = await searchParamsLoader(props.searchParams);
  const staffs = await caller.staff.all();
  const t = await getTranslations();
  return (
    <div className="px-4 py-2">
      <Tabs defaultValue={searchParams.tabId ?? "settings"} className="w-full">
        <TabsList>
          <TabsTrigger value="settings">{t("settings")}</TabsTrigger>
          <TabsTrigger value="journals">{t("journals")}</TabsTrigger>
          <TabsTrigger value="rh">
            <HugeiconsIcon icon={MoneyExchange01Icon} /> Configuration RH
          </TabsTrigger>
        </TabsList>
        <TabsContent value="settings">
          <div className="grid grid-cols-6 gap-4">
            <CanReceiveTransactionSummary
              className="col-span-2"
              staffs={staffs}
            />
          </div>
        </TabsContent>
        <TabsContent value="journals">
          <AccountingJournal />
        </TabsContent>
        <TabsContent value="rh">
          <ConfigurationRH />
        </TabsContent>
      </Tabs>
    </div>
  );
}
