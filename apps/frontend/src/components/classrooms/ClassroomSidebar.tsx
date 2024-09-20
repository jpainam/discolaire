"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { toast } from "sonner";

import { useLocale } from "@repo/i18n";
import { Skeleton } from "@repo/ui/skeleton";

import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { sidebarIcons } from "./sidebar-icons";

export function ClassroomSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useParams();
  const menusQuery = api.menu.byCategory.useQuery({ category: "classroom" });

  const [items, setItems] = useState<{ name: string; href?: string }[]>([]);

  useEffect(() => {
    if (!menusQuery.data) return;
    const m = getMenu(
      menusQuery.data.map((item) => {
        return {
          name: item.name,
          href: item.href ?? undefined,
        };
      }),
      params.id as string,
    );
    setItems(m);
  }, [menusQuery.data, params.id]);

  const { t } = useLocale();

  if (menusQuery.isError) {
    toast.error(menusQuery.error.message);
    return;
  }

  ////fixed h-screen top-16 overflow-y-auto
  return (
    <aside
      className={cn(
        "fixed top-0 hidden h-screen flex-col overflow-y-auto px-1 pt-[130px] text-sm md:flex md:w-[220px]",
        className,
      )}
    >
      {menusQuery.isPending && (
        <div className="grid gap-2 p-2">
          {Array.from({ length: 32 }).map((_, index) => (
            <Skeleton key={index} className="h-8 w-full" />
          ))}
        </div>
      )}
      {items.map((item, index) => {
        const isActive = item.href ? pathname.includes(item.href) : false;
        const Icon = sidebarIcons[item.name];

        return (
          <Link
            key={item.name + "-" + index}
            href={params.id ? (item.href ?? "") : "#"}
            className={cn(
              "my-1 flex items-center justify-between rounded-md p-2 font-medium capitalize",
              isActive
                ? "before:top-2/5 bg-primary text-primary-foreground"
                : "transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900",
            )}
          >
            <div className="flex items-center truncate">
              {Icon && <Icon className="me-2 h-5 w-5 stroke-1" />}
              <span className="truncate">{t(item.name)}</span>
            </div>
          </Link>
        );
      })}
    </aside>
  );
}

function getMenu(data: { name: string; href?: string }[], id: string) {
  // replace :id by the actual id in all href
  return data.map((menu) => {
    return {
      ...menu,
      href: menu.href?.replace(":id", id),
    };
  });
}
