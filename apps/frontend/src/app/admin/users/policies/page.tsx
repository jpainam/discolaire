import { checkPermissions } from "@repo/api/permission";
import { getServerTranslations } from "@repo/i18n/server";
import { PermissionAction } from "@repo/lib/permission";

import { PolicyHeader } from "~/components/administration/policies/PolicyHeader";
import { PolicyTable } from "~/components/administration/policies/PolicyTable";
import { PageHeader } from "../../../(dashboard)/administration/PageHeader";

export default async function Page() {
  const canDeletePolicy = await checkPermissions(
    PermissionAction.DELETE,
    "policy",
  );
  const canEditPolicy = await checkPermissions(
    PermissionAction.UPDATE,
    "policy",
  );
  const { t } = await getServerTranslations();
  return (
    <div className="flex flex-col">
      <PageHeader title={t("policies")}>
        <PolicyHeader />
      </PageHeader>
      <PolicyTable canDelete={canDeletePolicy} canEdit={canEditPolicy} />
    </div>
  );
}
