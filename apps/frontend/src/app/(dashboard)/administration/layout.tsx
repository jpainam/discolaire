import type { PropsWithChildren } from "react";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { BreadcrumbsSetter } from "~/components/BreadcrumbsSetter";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";

export default async function Layout({ children }: PropsWithChildren) {
  //const session = await getSession();
  const canSeeAdminMenu = await checkPermission(
    "menu:administration",
    PermissionAction.READ,
  );
  if (!canSeeAdminMenu) {
    redirect("/");
  }
  const t = await getTranslations();
  return (
    <div className="flex flex-col">
      <BreadcrumbsSetter
        items={[
          { label: t("home"), href: "/" },
          { label: t("administration"), href: "/administration" },
        ]}
      />
      {children}
    </div>
  );
}
