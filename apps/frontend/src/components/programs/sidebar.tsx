"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";
import SimpleBar from "../simplebar";
import { menuItems } from "./menu-items";

export default function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <aside className={cn("h-full border-e-2 border-gray-100", className)}>
      <SimpleBar className="h-[calc(100%-80px)]">
        <div className="3xl:mt-6 mt-4 pb-3">
          {menuItems.map((item, index) => {
            const isActive = pathname === (item.href!);
            const pathnameExistInDropdowns: any = item.dropdownItems?.filter(
              (dropdownItem) => dropdownItem.href === pathname,
            );
            const isDropdownOpen = Boolean(pathnameExistInDropdowns?.length);

            return (
              <Link
                key={item.name + "-" + index}
                href={item.href || "#"}
                className={cn(
                  "group relative mx-3 my-0.5 flex items-center justify-between rounded-md px-3 py-2 font-medium capitalize lg:my-1 2xl:mx-5 2xl:my-2",
                  isActive
                    ? "before:top-2/5 text-primary before:absolute before:-start-3 before:block before:h-4/5 before:w-1 before:rounded-ee-md before:rounded-se-md before:bg-primary 2xl:before:-start-5"
                    : "text-gray-700 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-700/90",
                )}
              >
                <div className="flex items-center truncate">
                  {item.icon && (
                    <span
                      className={cn(
                        "me-2 inline-flex h-5 w-5 items-center justify-center rounded-md [&>svg]:h-[20px] [&>svg]:w-[20px]",
                        isActive
                          ? "text-primary"
                          : "text-gray-800 dark:text-gray-500 dark:group-hover:text-gray-700",
                      )}
                    >
                      {item.icon}
                    </span>
                  )}
                  <span className="truncate">{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </SimpleBar>
    </aside>
  );
}
