import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "./PageHeader";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={t("administration")}></PageHeader>
    </div>
  );
}
