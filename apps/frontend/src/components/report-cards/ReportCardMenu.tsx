"use client";
import { routes } from "@/configs/routes";
import Link from "next/link";

import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

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
    <div className="bg-muted text-sm flex flex-row gap-4 py-2 border-b px-4 text-muted-foreground">
      {menuItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            className={cn(
              isActive
                ? "bg-secondary border-b-2 border-blue-500 text-secondary-foreground"
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
