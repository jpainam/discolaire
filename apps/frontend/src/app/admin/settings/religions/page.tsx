import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "../../../(dashboard)/administration/PageHeader";
import { ReligionAction } from "./ReligionAction";
import { ReligionTable } from "./ReligionTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={`${t("settings")} - ${t("religions")}`}>
        <ReligionAction />
      </PageHeader>
      <ReligionTable />
    </div>
  );
}
