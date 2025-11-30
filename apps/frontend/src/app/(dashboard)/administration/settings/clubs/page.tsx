import { getTranslations } from "next-intl/server";

import { Label } from "@repo/ui/components/label";

import { ClubTable } from "./ClubTable";

export default async function Page() {
  const t = await getTranslations();

  return (
    <div className="mx-auto flex flex-col gap-2 p-4">
      <div className="flex flex-row items-center">
        <Label>{`${t("settings")} - ${t("clubs")}`}</Label>
      </div>
      <ClubTable />
    </div>
  );
}
