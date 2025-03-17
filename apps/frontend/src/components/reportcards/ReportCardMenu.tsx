"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale } from "~/i18n";

import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";

export function ReportCardMenu() {
  const { t } = useLocale();
  const pathname = usePathname();
  const menuItems: { href: string; label: string }[] = [
    { href: routes.reportcards.index, label: t("reportcards") },
    // { href: routes.reportcards.transcripts, label: t("transcripts") },
    { href: routes.reportcards.appreciations, label: t("appreciations") },
    { href: routes.reportcards.charts, label: t("charts") },
  ];

  return (
    <div className="flex flex-row gap-4 border-b bg-muted px-4 py-2 text-sm text-muted-foreground">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={cn(
              isActive
                ? "border-b-2 border-blue-500 bg-secondary text-secondary-foreground"
                : "",
            )}
            href={item.href}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
