"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { useLocale } from "@repo/i18n";
import { DataTableSkeleton } from "@repo/ui/data-table/v2/data-table-skeleton";
import { SortableList } from "@repo/ui/dnd/dnd-sortable-list";

import Menu from "~/components/menu/dropdown/menu";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { sidebarIcons } from "./sidebar-icons";

export function StudentSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useParams<{ id: string }>();
  const menusQuery = api.menu.byCategory.useQuery({ category: "student" });

  const [items, setItems] = useState<
    { id: number; name: string; href?: string; title: string }[]
  >([]);

  useEffect(() => {
    if (!menusQuery.data) return;
    const m = getMenu(
      menusQuery.data.map((item) => {
        return {
          name: item.name,
          title: item.title,
          id: item.id,
          href: item.href ?? undefined,
        };
      }),
      params.id,
    );
    setItems(m);
  }, [menusQuery.data, params.id]);

  const { t } = useLocale();

  if (menusQuery.isPending) {
    return (
      <div className="w-[200px] px-1">
        <DataTableSkeleton
          rowCount={15}
          columnCount={1}
          withPagination={false}
          showViewOptions={false}
        />
      </div>
    );
  }

  return (
    <aside className={cn("mb-0 hidden md:flex md:w-[200px]", className)}>
      <ul className="w-full">
        <SortableList items={items} onChange={setItems}>
          {items.map((item, index) => {
            //const Icon = item.icon;
            const Icon = sidebarIcons[item.name];
            const isActive = pathname === item.href;
            return (
              <Fragment key={"sortable-menu" + item.name + "-" + index}>
                <SortableList.Item id={item.id}>
                  <Menu
                    trigger="hover"
                    placement="right-start"
                    offset={2}
                    //opened={true}
                    closeDelay={0}
                  >
                    <Menu.Trigger>
                      <div
                        className={cn(
                          "relative m-1 flex grow cursor-pointer items-center justify-between overflow-hidden rounded-md px-2 py-2 transition-all hover:ps-7",
                          "transition-all duration-200 hover:bg-primary hover:text-primary-foreground",
                          isActive ? "bg-primary text-primary-foreground" : "",
                        )}
                      >
                        <Link
                          href={item.href ?? "#"}
                          className="flex w-full items-center gap-1 text-sm"
                        >
                          <SortableList.DragHandle
                            className={cn(
                              "inset-t-0 absolute h-5 w-5 -translate-x-7 bg-primary text-primary-foreground transition-all group-hover:-translate-x-6 [&>svg]:h-[20px] [&>svg]:w-[20px]",
                            )}
                          />
                          {Icon && <Icon className="h-4 w-4" />}
                          {t(item.title)}
                        </Link>
                      </div>
                    </Menu.Trigger>
                  </Menu>
                </SortableList.Item>
              </Fragment>
            );
          })}
        </SortableList>
      </ul>
    </aside>
  );
}

function getMenu(
  data: { id: number; title: string; name: string; href?: string }[],
  id: string,
) {
  // replace :id by the actual id in all href
  return data.map((menu) => {
    return {
      ...menu,
      href: menu.href?.replace(":id", id),
    };
  });
}
