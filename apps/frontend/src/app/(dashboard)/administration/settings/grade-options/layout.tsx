import type { PropsWithChildren } from "react";

import { getServerTranslations } from "@repo/i18n/server";
import { Label } from "@repo/ui/label";

export default async function Layout({ children }: PropsWithChildren) {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <Label>{t("grade_options")} </Label>
      {children}
    </div>
  );
}
