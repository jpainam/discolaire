import { notFound } from "next/navigation";

import { Label } from "@repo/ui/components/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";

import { getServerTranslations } from "~/i18n/server";
import { caller } from "~/trpc/server";
import { PolicyDataTable } from "./PolicyDataTable";
import { UserDataTable } from "./UserDataTable";

export default async function Page(props: {
  params: Promise<{ roleId: string }>;
}) {
  const params = await props.params;

  const { roleId } = params;

  const { t } = await getServerTranslations();
  const role = await caller.role.get(roleId);

  if (!role) {
    notFound();
  }
  return (
    <div className="flex flex-col gap-2">
      <Label>{`${t("role")} - ${role.name}`}</Label>

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
