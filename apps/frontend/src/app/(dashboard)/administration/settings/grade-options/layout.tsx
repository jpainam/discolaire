import type { PropsWithChildren } from "react";

import { Label } from "@repo/ui/components/label";
import { getServerTranslations } from "~/i18n/server";

export default async function Layout({ children }: PropsWithChildren) {
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col gap-2">
      <Label>{t("grade_options")} </Label>
      {children}
    </div>
  );
}
