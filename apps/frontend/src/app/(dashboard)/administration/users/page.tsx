"use client";

import { Separator } from "@repo/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { UserDataTable } from "~/components/administration/users/users-table";
import { useLocale } from "~/hooks/use-locale";

export default function AdminUsersPage() {
  const { t } = useLocale();
  return (
    <div className="p-2">
      <Tabs defaultValue="all">
        <div className="flex items-center px-4 py-2">
          <h1 className="text-xl font-bold">{t("users_management")}</h1>
          <TabsList className="ml-auto">
            <TabsTrigger
              value="all"
              className="text-zinc-600 dark:text-zinc-200"
            >
              {t("active")}
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="text-zinc-600 dark:text-zinc-200"
            >
              {t("inactive")}
            </TabsTrigger>
          </TabsList>
        </div>
        <Separator />
        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form>
            <div className="relative">
              {/*<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />*/}
            </div>
          </form>
        </div>
        <TabsContent value="all" className="m-0">
          <UserDataTable />
        </TabsContent>
        <TabsContent value="unread" className="m-0">
          <UserDataTable />
        </TabsContent>
      </Tabs>
    </div>
  );
}
