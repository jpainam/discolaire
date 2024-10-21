import { getServerTranslations } from "@repo/i18n/server";

import { SchoolYearHeader } from "~/components/schoolyears/SchoolYearHeader";
import { SchoolYearTable } from "~/components/schoolyears/SchoolYearTable";
import { PageHeader } from "../../(dashboard)/administration/PageHeader";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="p4 flex flex-col gap-2">
      <PageHeader title={t("schoolYear")}>
        <SchoolYearHeader />
      </PageHeader>

      <SchoolYearTable />
    </div>
  );
}
