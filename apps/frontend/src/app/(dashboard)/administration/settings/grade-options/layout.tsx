import type { PropsWithChildren } from "react";

import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "../../PageHeader";

export default async function Layout({ children }: PropsWithChildren) {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <PageHeader title={t("grade_options")} />
      {children}
    </div>
  );
}
