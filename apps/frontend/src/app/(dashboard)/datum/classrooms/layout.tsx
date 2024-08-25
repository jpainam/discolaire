import React from "react";
import { getServerTranslations } from "@/app/i18n/server";
import { checkPermissions } from "@/server/permission";
import { PermissionAction } from "@/types/permission";
import { NoPermission } from "@repo/ui/NoPermission";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = await getServerTranslations();
  const canReadClassroom = await checkPermissions(
    PermissionAction.READ,
    "classroom",
  );
  if (!canReadClassroom) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return <div className="min-h-[60vh]">{children}</div>;
}
