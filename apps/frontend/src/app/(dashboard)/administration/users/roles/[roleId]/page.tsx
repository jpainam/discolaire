import { notFound } from "next/navigation";

import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { api } from "~/trpc/server";
import { PolicyDataTable } from "./PolicyDataTable";
import { UserDataTable } from "./UserDataTable";

export default async function Page({
  params: { roleId },
}: {
  params: { roleId: string };
}) {
  const { t, i18n } = await getServerTranslations();
  const role = await api.role.get(roleId);
  const dateFormatter = Intl.DateTimeFormat(i18n.language, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (!role) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-4 p-2">
      <div className="grid divide-y rounded-lg border bg-secondary px-4 text-secondary-foreground md:grid-cols-3">
        <div className="flex flex-row items-center gap-2">
          <Label>
            {t("role")} - {t("name")}
          </Label>
          <span>{role.name}</span>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Label>{t("createdAt")}</Label>
          <span>{dateFormatter.format(role.createdAt)}</span>
        </div>
      </div>
      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">{t("users")}</TabsTrigger>
          <TabsTrigger value="permissions">{t("permissions")}</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          <UserDataTable roleId={roleId} />
        </TabsContent>
        <TabsContent value="permissions">
          <PolicyDataTable roleId={roleId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
