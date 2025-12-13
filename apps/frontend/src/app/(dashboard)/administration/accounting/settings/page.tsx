import { getTranslations } from "next-intl/server";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { caller } from "~/trpc/server";
import { CanReceiveTransactionSummary } from "./CanReceiveTransactionSummary";
import { AccountingJournal } from "./journal/AccountingJournal";

export default async function Page() {
  const staffs = await caller.staff.all();
  const t = await getTranslations();
  return (
    <div className="px-4 py-2">
      <Tabs defaultValue="settings" className="w-full">
        <TabsList>
          <TabsTrigger value="settings">{t("settings")}</TabsTrigger>
          <TabsTrigger value="journals">{t("journals")}</TabsTrigger>
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
      </Tabs>
    </div>
  );
}
