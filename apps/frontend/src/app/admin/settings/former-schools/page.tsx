import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "../../../(dashboard)/administration/PageHeader";
import { SchoolAction } from "./SchoolAction";
import { SchoolDataTable } from "./SchoolDataTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={`${t("settings")} - ${t("former_schools")}`}>
        <SchoolAction />
      </PageHeader>
      <div className="p-2">
        <SchoolDataTable />
      </div>
    </div>
  );
}
