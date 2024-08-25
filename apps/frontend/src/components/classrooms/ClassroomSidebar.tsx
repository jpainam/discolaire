"use client";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";

import { MenuItemsType } from "@/types/menu";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { api } from "@/trpc/react";
import { DataTableSkeleton } from "../data-table/data-table-skeleton";
import { Badge } from "../ui/badge";
import { sidebarIcons } from "./sidebar-icons";

export function ClassroomSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useParams();
  const menusQuery = api.menu.byCategory.useQuery({ category: "classroom" });

  const [items, setItems] = useState<MenuItemsType[]>([]);

  useEffect(() => {
    if (!menusQuery.data) return;
    const m = getMenu(menusQuery.data, params.id as string);
    setItems(m);
  }, [menusQuery.data, params.id]);

  const { t } = useLocale();
  if (menusQuery.isPending) {
    return (
      <DataTableSkeleton
        rowCount={18}
        className="px-1 w-[200px]"
        columnCount={1}
        withPagination={false}
        showViewOptions={false}
      />
    );
  }
  if (menusQuery.isError) {
    throw menusQuery.error;
  }

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col md:w-[200px] m-2 text-sm",
        className
      )}
    >
      {items.map((item, index) => {
        const isActive = pathname === (item?.href as string);
        const pathnameExistInDropdowns: any = item?.menuItems?.filter(
          (dropdownItem) => dropdownItem.href === pathname
        );
        const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);
        const Icon = sidebarIcons?.[item.name];

        return (
          <Link
            key={item.name + "-" + index}
            href={params.id ? item?.href || "" : "#"}
            className={cn(
              "my-1 flex items-center justify-between rounded-md p-2 font-medium capitalize",
              isActive
                ? "before:top-2/5 text-primary-foreground  bg-primary"
                : "transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 "
            )}
          >
            <div className="flex items-center truncate">
              {Icon && <Icon className="stroke-1 h-5 w-5 me-2" />}
              <span className="truncate">{t(item.name)}</span>
            </div>
            {item?.badge?.length ? <Badge> {t(item?.badge)}</Badge> : null}
          </Link>
        );
      })}
    </aside>
  );
}

function getMenu(data: MenuItemsType[], id: string) {
  if (!data) return [];
  // replace :id by the actual id in all href
  return data?.map((menu) => {
    return {
      ...menu,
      href: menu.href?.replace(":id", id),
      menuItems: menu.menuItems.map((item) => {
        return {
          ...item,
          href: item?.href?.replace(":id", id),
          subMenuItems: item.subMenuItems?.map((subItem) => {
            return {
              ...subItem,
              href: subItem.href.replace(":id", id),
            };
          }),
        };
      }),
    };
  });
}
