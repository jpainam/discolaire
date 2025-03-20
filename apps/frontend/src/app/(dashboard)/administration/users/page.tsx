import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";

import { UserDataTable } from "~/components/administration/users/UserDataTable";
import { api } from "~/trpc/server";

export default async function Page() {
  const { t } = await getServerTranslations();
  const users = await api.user.all({});
  return (
    <div className="flex gap-2 p-4 flex-col">
      <Label>{t("users")}</Label>
      <UserDataTable users={users} />
    </div>
  );
}
