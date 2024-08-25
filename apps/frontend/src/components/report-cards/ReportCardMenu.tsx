"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "~/configs/routes";
import { useLocale } from "~/hooks/use-locale";
import { cn } from "~/lib/utils";

export function ReportCardMenu() {
  const { t } = useLocale();
  const pathname = usePathname();
  const menuItems: { href: string; label: string }[] = [
    { href: routes.report_cards.index, label: t("report_cards") },
    // { href: routes.report_cards.transcripts, label: t("transcripts") },
    { href: routes.report_cards.appreciations, label: t("appreciations") },
    { href: routes.report_cards.charts, label: t("charts") },
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
