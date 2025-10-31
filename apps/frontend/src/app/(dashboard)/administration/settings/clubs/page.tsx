import { Label } from "@repo/ui/components/label";

import { getServerTranslations } from "~/i18n/server";
import { ClubTable } from "./ClubTable";

export default async function Page() {
  const { t } = await getServerTranslations();

  return (
    <div className="mx-auto flex flex-col gap-2 p-4">
      <div className="flex flex-row items-center">
        <Label>{`${t("settings")} - ${t("clubs")}`}</Label>
      </div>
      <ClubTable />
    </div>
  );
}
