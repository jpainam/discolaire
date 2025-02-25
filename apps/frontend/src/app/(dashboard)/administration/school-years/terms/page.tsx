import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";

import { TermHeader } from "./TermHeader";
import { TermTable } from "./TermTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row items-center justify-center">
        <Label>{t("terms")}</Label>
        <TermHeader />
      </div>
      <TermTable />
    </div>
  );
}
