import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";

import { UserDataTable } from "~/components/administration/users/UserDataTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex gap-2 flex-col p-4">
      <Label>{t("users")}</Label>
      <UserDataTable />
    </div>
  );
}
