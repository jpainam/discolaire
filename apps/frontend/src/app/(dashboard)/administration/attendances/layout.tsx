import type { PropsWithChildren } from "react";
import { getTranslations } from "next-intl/server";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

export default async function Layout(props: PropsWithChildren) {
  const t = await getTranslations();
  return (
    <Tabs defaultValue="tab-1" className="w-full">
      <TabsList>
        <TabsList className="gap-1 bg-transparent">
          <TabsTrigger
            value="tab-1"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            {t("dashboard")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-3"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            {t("students")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-4"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            {t("notifications")}
          </TabsTrigger>
          <TabsTrigger
            value="tab-5"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground rounded-full data-[state=active]:shadow-none"
          >
            {t("settings")}
          </TabsTrigger>
        </TabsList>
      </TabsList>
      <TabsContent value="tab-1">{props.children}</TabsContent>
      <TabsContent value="tab-2"></TabsContent>
      <TabsContent value="tab-3">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
      <TabsContent value="tab-4">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
      <TabsContent value="tab-5">
        <p className="text-muted-foreground p-4 text-center text-xs">
          Content for Tab 3
        </p>
      </TabsContent>
    </Tabs>
  );
}
