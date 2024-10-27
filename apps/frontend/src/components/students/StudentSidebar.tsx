"use client";

import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { useLocale } from "@repo/i18n";
import { SortableList } from "@repo/ui/dnd/dnd-sortable-list";
import { Skeleton } from "@repo/ui/skeleton";

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

  // "fixed top-0 hidden h-screen flex-col overflow-y-auto px-1 pt-[130px] text-sm md:flex md:w-[220px]",
  return (
    <aside
      className={cn(
        "fixed top-0 hidden h-screen flex-col overflow-y-auto pt-[130px] md:flex md:w-[220px]",
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
      <ul className="w-full">
        <SortableList items={items} onChange={setItems}>
          {items.map((item, index) => {
            //const Icon = item.icon;
            const Icon = sidebarIcons[item.name];
            let isActive = item.href ? pathname.includes(item.href) : false;
            if (
              item.title == "profile" &&
              pathname.split("/").pop() != params.id
            ) {
              isActive = false;
            }
            return (
              <Fragment key={"sortable-menu" + item.name + "-" + index}>
                <SortableList.Item id={item.id}>
                  <div>
                    <div>
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
                    </div>
                  </div>
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
