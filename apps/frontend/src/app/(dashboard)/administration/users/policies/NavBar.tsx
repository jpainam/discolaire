"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

import { useLocale } from "@repo/hooks/use-locale";
import { ScrollArea, ScrollBar } from "@repo/ui/scroll-area";

import { cn } from "~/lib/utils";

export function NavBar({ className }: { className?: string }) {
  const { t } = useLocale();
  const searchParams = useSearchParams();
  const items = [
    {
      name: t("student"),
      key: "student",
    },
    {
      name: t("classroom"),
      key: "classroom",
    },
    {
      name: t("staff"),
      key: "staff",
    },
    {
      name: t("contact"),
      key: "contact",
    },
    {
      name: t("user"),
      key: "user",
    },
    {
      name: t("transaction"),
      key: "transaction",
    },
    {
      name: t("policy"),
      key: "policy",
    },
  ];
  const pathname = usePathname();

  return (
    <div className="relative">
      <ScrollArea className="max-w-[600px] lg:max-w-none">
        <div className={cn("mb-4 flex items-center", className)}>
          {items.map((item, index) => (
            <Link
              href={`?cat=${item.key}`}
              key={item.key}
              className={cn(
                "flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary",
                searchParams.get("cat") == item.key ||
                  (index === 0 && pathname === "/administration/users/policies")
                  ? "bg-muted font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
