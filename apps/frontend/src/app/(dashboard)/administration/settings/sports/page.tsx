import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";

import { SportAction } from "./SportAction";
import { SportTable } from "./SportTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-between">
        <Label>{`${t("settings")} - ${t("sports")}`}</Label>
        <SportAction />
      </div>
      <SportTable />
    </div>
  );
}
