"use client";

import { ElementType, Fragment, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import Menu from "@repo/ui/menu/dropdown/menu";
import { PiCaretDownBold } from "react-icons/pi";

import { SortableList } from "~/components/dnd/dnd-sortable-list";
import { useLocale } from "~/hooks/use-locale";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import { MenuItemsType } from "~/types/menu";
import { DataTableSkeleton } from "../data-table/v2/data-table-skeleton";
import { Badge } from "../ui/badge";
import { sidebarIcons } from "./sidebar-icons";

export function StudentSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const params = useParams() as { id: string };
  const menusQuery = api.menu.byCategory.useQuery({ category: "student" });

  const [items, setItems] = useState<MenuItemsType[]>([]);

  useEffect(() => {
    if (!menusQuery.data) return;
    const m = getMenu(menusQuery.data, params.id);
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
            const Icon = sidebarIcons?.[item.name];
            const isActive = pathname === (item?.href as string);
            const pathnameExistInDropdowns: boolean = item?.menuItems?.some(
              (dropdownItem) =>
                dropdownItem.href === pathname ||
                dropdownItem.subMenuItems?.some(
                  (subMenuItem) => subMenuItem.href === pathname,
                ),
            );
            const isDropdownOpen = Boolean(pathnameExistInDropdowns);
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
                          isDropdownOpen
                            ? "bg-secondary"
                            : "transition-all duration-200 hover:bg-primary hover:text-primary-foreground",
                          isActive ? "bg-primary text-primary-foreground" : "",
                        )}
                      >
                        <Link
                          href={item?.href || "#"}
                          className="flex w-full items-center gap-1 text-sm"
                        >
                          <SortableList.DragHandle
                            className={cn(
                              "inset-t-0 absolute h-5 w-5 -translate-x-7 bg-primary text-primary-foreground transition-all group-hover:-translate-x-6 [&>svg]:h-[20px] [&>svg]:w-[20px]",
                              isDropdownOpen ? "text-gray-0" : "",
                            )}
                          />
                          {Icon && <Icon className="h-4 w-4" />}
                          {t(item.title)}
                        </Link>

                        {item?.menuItems?.length > 0 && (
                          <div className="flex items-center transition-all group-hover:gap-1">
                            <PiCaretDownBold
                              strokeWidth={3}
                              className={cn(
                                "h-4 w-4 -rotate-90 transition-transform duration-200 rtl:rotate-90",
                                isDropdownOpen ? "text-gray-0" : "",
                              )}
                            />
                          </div>
                        )}
                      </div>
                    </Menu.Trigger>
                    {item?.menuItems?.length > 0 && (
                      <Menu.List className="w-[280px] border-gray-300 !bg-white !px-2 !py-3 dark:bg-gray-100">
                        {item?.menuItems?.map((dropdownItem, index) => {
                          const isChildActive =
                            pathname === (dropdownItem?.href as string);
                          const pathnameExistInChildDropdowns: any =
                            dropdownItem?.subMenuItems?.filter(
                              (dropdownItem) => dropdownItem.href === pathname,
                            );
                          const isChildDropdownActive = Boolean(
                            pathnameExistInChildDropdowns?.length,
                          );
                          //const DropdownIcon = dropdownItem?.icon;
                          const DropdownIcon =
                            sidebarIcons?.[dropdownItem?.name];

                          return (
                            <Menu.Item
                              key={"dropdown" + dropdownItem?.name + index}
                              className={cn(
                                "!data-[hover=true]:bg-gray-200 px-0 py-0 transition-all data-[hover=true]:dark:bg-gray-200",
                                isChildDropdownActive &&
                                  "!bg-gray-200 dark:bg-gray-200",
                              )}
                            >
                              {dropdownItem?.subMenuItems?.length ? (
                                <ul className="w-full">
                                  <Menu
                                    trigger="hover"
                                    placement="right-start"
                                    offset={0}
                                    closeDelay={0}
                                  >
                                    <Menu.Trigger>
                                      <li
                                        className={cn(
                                          "relative flex cursor-pointer items-center justify-between rounded-md px-4 py-2",
                                          isChildDropdownActive
                                            ? "before:top-2/5 rounded-md bg-gray-100 text-primary before:absolute before:start-0 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary dark:bg-gray-200 2xl:before:start-0"
                                            : "text-gray-700 transition-all duration-200 hover:bg-gray-100 dark:text-gray-700/90 hover:dark:bg-gray-200 dark:hover:text-gray-700",
                                        )}
                                      >
                                        <span className="flex items-center text-sm">
                                          {DropdownIcon && (
                                            <span
                                              className={cn(
                                                "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                                                isChildDropdownActive
                                                  ? "text-primary"
                                                  : "text-gray-400 dark:text-gray-500 dark:group-hover:text-gray-700",
                                              )}
                                            >
                                              <DropdownIcon className="h-4 w-4 stroke-1" />
                                            </span>
                                          )}
                                          {t(dropdownItem.name)}
                                        </span>

                                        <PiCaretDownBold
                                          strokeWidth={3}
                                          className={cn(
                                            "h-4 w-4 -rotate-90 transition-transform duration-200 rtl:rotate-90",
                                            isChildDropdownActive
                                              ? "text-primary"
                                              : "text-gray-900",
                                          )}
                                        />
                                      </li>
                                    </Menu.Trigger>
                                    <Menu.List className="border-gray-300 bg-gray-100">
                                      {dropdownItem?.subMenuItems?.map(
                                        (subMenuItem, index) => {
                                          const isChildActive =
                                            pathname ===
                                            (subMenuItem?.href as string);

                                          return (
                                            <Menu.Item
                                              key={
                                                "sub-menu" +
                                                subMenuItem?.name +
                                                index
                                              }
                                              className="px-0 py-0"
                                            >
                                              <Link
                                                href={subMenuItem?.href}
                                                className={cn(
                                                  "relative flex w-full items-center justify-between rounded-md px-4 py-2 font-medium text-gray-900",
                                                  isChildActive
                                                    ? "text-primary"
                                                    : "bg-gray-200 text-gray-900 transition-colors duration-200 hover:text-gray-900",
                                                )}
                                              >
                                                <span className="flex items-center truncate text-sm">
                                                  <span className="truncate">
                                                    {t(subMenuItem?.name)}
                                                  </span>
                                                </span>
                                                {subMenuItem?.badge?.length ? (
                                                  <Badge>
                                                    {subMenuItem?.badge}
                                                  </Badge>
                                                ) : null}
                                              </Link>
                                            </Menu.Item>
                                          );
                                        },
                                      )}
                                    </Menu.List>
                                  </Menu>
                                </ul>
                              ) : (
                                <MenuLink
                                  item={dropdownItem}
                                  isChildActive={isChildActive}
                                  isDropdownOpen={isDropdownOpen}
                                />
                              )}
                            </Menu.Item>
                          );
                        })}
                      </Menu.List>
                    )}
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

type MenuItemsProps = {
  as?: ElementType;
  item: any;
  isChildActive?: boolean;
  isDropdownOpen?: boolean;
  className?: string;
};

function MenuLink({ item, isChildActive }: MenuItemsProps) {
  //const Icon = item?.icon;
  const Icon = sidebarIcons?.[item?.name];
  const { t } = useLocale();
  return (
    <Link
      href={item?.href}
      className={cn(
        "relative flex w-full items-center justify-between rounded-md px-4 py-2 font-medium text-gray-900",
        isChildActive
          ? "before:top-2/5 bg-gray-100 text-primary before:absolute before:-start-2.5 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary dark:bg-gray-200 2xl:before:-start-2.5"
          : "text-gray-700/90 text-gray-900 transition-colors duration-200 hover:bg-gray-200",
      )}
    >
      <div className="flex items-center truncate">
        {Icon && <Icon className="h-4 w-4 stroke-1" />}
        <span className="truncate text-sm">{t(item?.name)}</span>
      </div>
      {item?.badge?.length ? <Badge>{item?.badge} </Badge> : null}
    </Link>
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
