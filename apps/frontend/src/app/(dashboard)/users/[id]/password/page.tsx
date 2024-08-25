import { Separator } from "@repo/ui/separator";

import { getServerTranslations } from "~/app/i18n/server";
import { ReinitializePasswordForm } from "~/components/users/password/reinitialize-password";

export default async function Page() {
  const { t } = await getServerTranslations();
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">{t("reinitializeUserPassword")}</h3>
        <p className="text-sm text-muted-foreground">
          {t("reinitializeUserPasswordDescription")}
        </p>
      </div>
      <Separator />
      <ReinitializePasswordForm />
    </div>
  );
}
