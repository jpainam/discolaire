import { checkPermissions } from "@repo/api/permission";
import { getServerTranslations } from "@repo/i18n/server";
import { PermissionAction } from "@repo/lib/permission";
import { Label } from "@repo/ui/label";

import { PolicyHeader } from "~/components/administration/policies/PolicyHeader";
import { NavBar } from "./NavBar";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const canReadPolicy = await checkPermissions(PermissionAction.READ, "policy");
  if (!canReadPolicy) {
    //return <NoPermission className="py-8" />;
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
