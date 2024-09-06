import { notFound } from "next/navigation";

import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { api } from "~/trpc/server";

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
    <div className="flex flex-col p-2">
      <div className="grid divide-y bg-secondary text-secondary-foreground md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <Label>{t("user_group_name")}</Label>
          <span>{role.name}</span>
        </div>
        <div className="flex flex-col gap-2">
          <Label>{t("user_group_name")}</Label>
          <span>{dateFormatter.format(role.createdAt)}</span>
        </div>
      </div>
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList>
          <TabsTrigger value="users">{t("users")}</TabsTrigger>
          <TabsTrigger value="permissions">{t("permissions")}</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="permissions">
          Change your password here.
        </TabsContent>
      </Tabs>
    </div>
  );
}
