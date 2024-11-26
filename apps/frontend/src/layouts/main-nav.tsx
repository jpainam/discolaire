"use client";

import path from "path";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale } from "@repo/i18n";
import { PermissionAction } from "@repo/lib/permission";

import { Icons } from "~/components/icons";
import { siteConfig } from "~/configs/site";
import { useCheckPermissions } from "~/hooks/use-permissions";
import { cn } from "~/lib/utils";

interface MenuItem {
  label: string;
  href: string;
  sub_menus?: MenuItem[];
  actives?: string[];
}

export function MainNav({ className }: { className?: string }) {
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
  ];

  const canSeeAdminMenu = useCheckPermissions(
    PermissionAction.READ,
    "menu:administration",
  );
  if (canSeeAdminMenu) {
    mainNavItems.push({
      label: t("administration"),
      href: "/administration",
    });
  }
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
