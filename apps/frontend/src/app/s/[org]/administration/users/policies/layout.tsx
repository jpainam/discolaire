import { Label } from "@repo/ui/components/label";

import { PolicyHeader } from "~/components/administration/policies/PolicyHeader";
import { NoPermission } from "~/components/no-permission";
import { getServerTranslations } from "~/i18n/server";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { NavBar } from "./NavBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const canReadPolicy = await checkPermission("policy", PermissionAction.READ);
  if (!canReadPolicy) {
    return <NoPermission className="py-8" />;
  }
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <Label>{t("policies")}</Label>
        <PolicyHeader />
      </div>
      <NavBar className={"p-2"} />
      {children}
    </div>
  );
}
