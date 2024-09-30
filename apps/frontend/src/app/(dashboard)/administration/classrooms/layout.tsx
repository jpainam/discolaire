import type { PropsWithChildren } from "react";

import { getServerTranslations } from "@repo/i18n/server";

import { PageHeader } from "../PageHeader";
import { ClassroomTabMenu } from "./ClassroomTabMenu";

export default async function Layout({ children }: PropsWithChildren) {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <PageHeader title={t("classroom_settings")}>
        <ClassroomTabMenu />
      </PageHeader>
      {children}
    </div>
  );
}
