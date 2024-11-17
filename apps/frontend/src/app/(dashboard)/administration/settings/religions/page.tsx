import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/label";

import { ReligionAction } from "./ReligionAction";
import { ReligionTable } from "./ReligionTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <Label>{`${t("settings")} - ${t("religions")}`}</Label>
        <ReligionAction />
      </div>
      <ReligionTable />
    </div>
  );
}
