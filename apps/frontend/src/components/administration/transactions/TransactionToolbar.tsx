"use client";

import {
  ArrowLeftRight,
  //HandCoins,
  Percent,
  Sigma,
  Trash2,
} from "lucide-react";

import type { TabMenuOption } from "~/components/shared/TabMenu";
import { TabMenu } from "~/components/shared/TabMenu";
import { routes } from "~/configs/routes";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

export function TransactionToolbar() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  //const pathname = usePathname();

  const menuTabs: TabMenuOption[] = [
    {
      icon: <ArrowLeftRight className="h-4 w-4" />,
      name: t("transactions"),
      href: routes.administration.transactions,
    },
    {
      icon: <Sigma className="h-4 w-4" />,
      name: t("totals"),
      href:
        routes.administration.transactions + "/totals?" + createQueryString({}),
    },
    // {
    //   icon: <Euro className="h-4 w-4" />,
    //   name: t("required_fees"),
    //   href:
    //     routes.administration.transactions +
    //     "/required?" +
    //     createQueryString({}),
    // },
    {
      icon: <Percent className="h-4 w-4" />,
      name: t("discounts"),
      href:
        routes.administration.transactions +
        "/discounts?" +
        createQueryString({}),
    },
    {
      icon: <Trash2 className="h-4 w-4" />,
      name: t("deleted"),
      href:
        routes.administration.transactions +
        "/deleted?" +
        createQueryString({}),
    },
    // {
    //   icon: <HandCoins className="h-4 w-4" />,
    //   name: t("moratoriums"),
    //   href:
    //     routes.administration.transactions +
    //     "/moratoriums?" +
    //     createQueryString({}),
    // },
  ];

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
