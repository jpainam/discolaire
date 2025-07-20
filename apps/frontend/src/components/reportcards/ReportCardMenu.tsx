"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { routes } from "~/configs/routes";
import { useLocale } from "~/i18n";
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
    <div className="bg-muted text-muted-foreground flex flex-row gap-4 border-b px-4 py-2 text-sm">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={cn(
              isActive
                ? "bg-secondary text-secondary-foreground border-b-2 border-blue-500"
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
