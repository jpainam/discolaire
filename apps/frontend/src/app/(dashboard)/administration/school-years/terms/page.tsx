import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "../../PageHeader";
import { TermHeader } from "./TermHeader";
import { TermTable } from "./TermTable";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={t("terms")}>
        <TermHeader />
      </PageHeader>
      <TermTable />
    </div>
  );
}
