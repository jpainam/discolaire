"use client";

import { useParams } from "next/navigation";
import { CircleGauge, PlusIcon, Recycle } from "lucide-react";

import type { TabMenuOption } from "~/components/shared/TabMenu";
import { TabMenu } from "~/components/shared/TabMenu";
import { routes } from "~/configs/routes";
import { useCheckPermission } from "~/hooks/use-permission";
import { useLocale } from "~/i18n";
import { PermissionAction } from "~/permissions";

export function TransactionTabMenu() {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  const canCreateTransaction = useCheckPermission(
    "transaction",
    PermissionAction.CREATE,
  );

  const menuTabs: TabMenuOption[] = [
    {
      name: t("transactions"),
      href: routes.students.transactions.index(params.id),
      icon: <CircleGauge className="h-4 w-4" />,
    },
    {
      name: t("account"),
      href: routes.students.transactions.account(params.id),
      icon: <Recycle className="h-4 w-4" />,
    },
  ];
  if (canCreateTransaction) {
    menuTabs.push({
      name: t("create"),
      href: routes.students.transactions.create(params.id),
      icon: <PlusIcon className="h-4 w-4" />,
    });
  }
  return (
    <div className="bg-muted text-muted-foreground flex max-w-fit items-center rounded-full">
      {menuTabs.map((link, _index) => {
        return (
          <TabMenu
            key={link.href}
            //isActive={pathname === link.href}
            href={link.href}
            icon={link.icon}
            title={link.name}
          />
        );
      })}
    </div>
  );
}
