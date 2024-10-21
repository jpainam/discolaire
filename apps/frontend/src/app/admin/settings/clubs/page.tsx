import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "../../../(dashboard)/administration/PageHeader";
import { ClubAction } from "./ClubAction";
import { ClubTable } from "./ClubTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={`${t("settings")} - ${t("clubs")}`}>
        <ClubAction />
      </PageHeader>
      <ClubTable />
    </div>
  );
}
