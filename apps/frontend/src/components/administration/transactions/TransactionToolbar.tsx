"use client";

import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Euro,
  HandCoins,
  Percent,
  Sigma,
  Trash2,
} from "lucide-react";

import { useLocale } from "@repo/i18n";

import type { TabMenuOption } from "~/components/shared/TabMenu";
import { TabMenu } from "~/components/shared/TabMenu";
import { routes } from "~/configs/routes";

export function TransactionToolbar() {
  const { t } = useLocale();
  //const { createQueryString } = useCreateQueryString();
  const pathname = usePathname();

  const menuTabs: TabMenuOption[] = [
    {
      icon: <ArrowLeftRight className="h-4 w-4" />,
      name: t("transactions"),
      href: routes.administration.transactions,
    },
    {
      icon: <Sigma className="h-4 w-4" />,
      name: t("totals"),
      href: routes.administration.transactions + "/totals",
    },
    {
      icon: <Euro className="h-4 w-4" />,
      name: t("required_fees"),
      href: routes.administration.transactions + "/required",
    },
    {
      icon: <Percent className="h-4 w-4" />,
      name: t("discounts"),
      href: routes.administration.transactions + "/discounts",
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      name: t("deleted"),
      href: routes.administration.transactions + "/deleted",
    },
    {
      icon: <HandCoins className="h-4 w-4" />,
      name: t("moratoriums"),
      href: routes.administration.transactions + "/moratoriums",
    },
  ];

  return (
    <div className="flex max-w-fit items-center rounded-full bg-muted text-muted-foreground">
      {menuTabs.map((link, _index) => {
        return (
          <TabMenu
            key={link.href}
            isActive={pathname === link.href}
            href={link.href}
            icon={link.icon}
            title={link.name}
          />
        );
      })}
    </div>
  );
}
