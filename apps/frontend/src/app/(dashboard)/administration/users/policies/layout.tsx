import { checkPermissions } from "@repo/api/permission";
import { getServerTranslations } from "@repo/i18n/server";
import { PermissionAction } from "@repo/lib/permission";

import { PolicyHeader } from "~/components/administration/policies/PolicyHeader";
import { PageHeader } from "../../PageHeader";
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
      <PageHeader title={t("policies")}>
        <PolicyHeader />
      </PageHeader>
      <NavBar className={"p-2"} />
      {children}
    </div>
  );
}
