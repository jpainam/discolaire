import { getServerTranslations } from "@repo/i18n/server";

import { UserDataTable } from "~/components/administration/users/UserDataTable";
import { PageHeader } from "../PageHeader";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <PageHeader title={t("users")}></PageHeader>
      <div className="px-2">
        <UserDataTable />
      </div>
    </div>
  );
}
