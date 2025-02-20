import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/components/label";

import { SchoolYearHeader } from "~/components/schoolyears/SchoolYearHeader";
import { SchoolYearTable } from "~/components/schoolyears/SchoolYearTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="p4 flex flex-col gap-2">
      <div className="flex flex-row items-center justify-center">
        <Label>{t("schoolYear")}</Label>
        <SchoolYearHeader />
      </div>

      <SchoolYearTable />
    </div>
  );
}
