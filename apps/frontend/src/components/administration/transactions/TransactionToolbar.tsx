"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  Euro,
  HandCoins,
  Percent,
  Sigma,
  Trash2,
} from "lucide-react";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useLocale } from "@repo/i18n";
import { Separator } from "@repo/ui/separator";

import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";

export function TransactionToolbar() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const pathname = usePathname();

  const menus = [
    {
      icon: ArrowLeftRight,
      label: t("transactions"),
      href: routes.administration.transactions,
    },
    {
      icon: Sigma,
      label: t("totals"),
      href: routes.administration.transactions + "/totals",
    },
    {
      icon: Euro,
      label: t("required_fees"),
      href: routes.administration.transactions + "/required",
    },
    {
      icon: Percent,
      label: t("discounts"),
      href: routes.administration.transactions + "/discounts",
    },
    {
      icon: Trash2,
      label: t("deleted"),
      href: routes.administration.transactions + "/deleted",
    },
    {
      icon: HandCoins,
      label: t("moratoriums"),
      href: routes.administration.transactions + "/moratoriums",
    },
  ];

  return (
    <div className="mb-2 flex flex-col px-2">
      <ul className="flex flex-row items-center justify-start gap-4 pt-2">
        {menus.map((menu, index) => {
          const isActive = pathname === menu.href;
          const Icon = menu.icon;
          return (
            <li key={index} className="py-2">
              <Link
                className={cn(
                  "flex items-center p-2 text-sm",
                  isActive
                    ? "border-b border-b-primary"
                    : "text-muted-foreground",
                )}
                href={menu.href + "?" + createQueryString({})}
              >
                <Icon className="mr-1 h-4 w-4" />
                {menu.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <Separator className="-my-2" />
    </div>
  );
}
