import type { PropsWithChildren } from "react";

import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/label";

import { ClassroomTabMenu } from "./ClassroomTabMenu";

export default async function Layout({ children }: PropsWithChildren) {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <Label>{t("classroom_settings")}</Label>
        <ClassroomTabMenu />
      </div>
      {children}
    </div>
  );
}
