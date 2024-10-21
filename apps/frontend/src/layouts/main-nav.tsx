"use client";

import path from "path";
import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSetAtom } from "jotai";

import type { Permission } from "@repo/lib/permission";
import { useLocale } from "@repo/i18n";

import { Icons } from "~/components/icons";
import { siteConfig } from "~/configs/site";
import { permissionAtom } from "~/hooks/use-permissions";
import { cn } from "~/lib/utils";

interface MenuItem {
  label: string;
  href: string;
  sub_menus?: MenuItem[];
  actives?: string[];
}

export function MainNav({
  className,
  permissions,
}: {
  className?: string;
  permissions: Permission[];
}) {
  const setPermissionsAtom = useSetAtom(permissionAtom);

  useEffect(() => {
    // TODO - Current hack to set permission locally for useCheckPermissions
    setPermissionsAtom(permissions);
  }, [permissions, setPermissionsAtom]);

  const { t } = useLocale();
  const mainNavItems: MenuItem[] = [
    { label: t("home"), href: "/", actives: ["/"] },
    {
      label: t("datum"),
      href: "/datum",
    },
    { label: t("programs"), href: "/programs" },
    { label: t("report_cards"), href: "/report-cards" },
    { label: t("reportings"), href: "/reports" },
    {
      label: t("administration"),
      href: "/admin",
    },
  ];
  const pathname = usePathname();
  const pathName = path.basename(pathname);
  return (
    <div className={cn("hidden flex-1 md:flex", className)}>
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Icons.logo className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          {siteConfig.name}
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-sm">
        {mainNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-primary-foreground/80 dark:text-secondary-foreground",
              item.actives?.includes(pathName)
                ? "text-primary-foreground"
                : "text-primary-foreground/60",
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
