import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "../../../(dashboard)/administration/PageHeader";
import { SportAction } from "./SportAction";
import { SportTable } from "./SportTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={`${t("settings")} - ${t("sports")}`}>
        <SportAction />
      </PageHeader>
      <SportTable />
    </div>
  );
}
