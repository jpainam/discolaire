import { getServerTranslations } from "@repo/i18n/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { ReportQueueTable } from "~/components/reports/ReportQueueTable";

//import { getReportForUser, getReportsQueue } from "~/server/report-queues";

export default async function Page() {
  const { t } = await getServerTranslations();
  // const [reports, reportsForUser] = await Promise.all([
  //   getReportsQueue(),
  //   getReportForUser(),
  // ]);

  return (
    <div className="px-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-row justify-between">
          <h2 className="text-xl font-bold tracking-tight">
            {t("queueTitleDescription")}
          </h2>
          {/* <RefreshReportQueueButton /> */}
        </div>
        <Tabs defaultValue="myqueue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="myqueue">{t("myQueue")}</TabsTrigger>
            <TabsTrigger value="allqueues">{t("allQueues")}</TabsTrigger>
          </TabsList>
          <TabsContent value="myqueue">
            <div className="rounded-md border">
              <ReportQueueTable reports={[]} />
            </div>
          </TabsContent>
          <TabsContent value="allqueues">
            <div className="rounded-md border">
              <ReportQueueTable reports={[]} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
