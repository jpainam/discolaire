import { notFound } from "next/navigation";

import { getServerTranslations } from "@repo/i18n/server";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs";

import { api } from "~/trpc/server";
import { PageHeader } from "../../../../(dashboard)/administration/PageHeader";
import { PolicyDataTable } from "./PolicyDataTable";
import { UserDataTable } from "./UserDataTable";

export default async function Page(
  props: {
    params: Promise<{ roleId: string }>;
  }
) {
  const params = await props.params;

  const {
    roleId
  } = params;

  const { t } = await getServerTranslations();
  const role = await api.role.get(roleId);

  if (!role) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={`${t("role")} - ${role.name}`} />

      <Tabs defaultValue="users" className="px-2">
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
