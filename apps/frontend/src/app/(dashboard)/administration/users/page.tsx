import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";

import { UserDataTable } from "~/components/administration/users/UserDataTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <Label>{t("users")}</Label>
      <UserDataTable />
    </div>
  );
}
