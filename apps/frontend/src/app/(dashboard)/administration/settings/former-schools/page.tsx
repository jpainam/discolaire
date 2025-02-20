import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/components/label";

import { SchoolAction } from "./SchoolAction";
import { SchoolDataTable } from "./SchoolDataTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-center">
        <Label>{`${t("settings")} - ${t("former_schools")}`}</Label>
        <SchoolAction />
      </div>

      <SchoolDataTable />
    </div>
  );
}
