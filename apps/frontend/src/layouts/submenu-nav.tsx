"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useLocale } from "@repo/i18n";

import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";

const sub_menus = [
  // { label: "quick_search", href: routes.datum.index },
  { label: "students", href: routes.students.index },
  { label: "classrooms", href: routes.classrooms.index },
  { label: "assignments", href: routes.assignments.index },
  { label: "parents", href: routes.contacts.index },
  { label: "staffs", href: routes.staffs.index },
  { label: "timetables", href: routes.timetables.index },
];

export function SubMenuNav() {
  const pathname = usePathname();
  const { t } = useLocale();
  const pathnameKey =
    pathname != "/datum" ? pathname.split("/")[2] : "quick_search";

  const menus = sub_menus;
  return (
    <div className="flex flex-row items-center gap-0 text-sm">
      {menus?.map((item, index) => {
        const isActive = pathnameKey && item.href.includes(pathnameKey);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "items-center border-blue-700 bg-transparent px-2 py-2 hover:border-b-2 hover:bg-secondary hover:text-foreground",
              isActive ? "border-b-2 bg-secondary text-foreground" : "",
            )}
          >
            {t(item.label)}
          </Link>
        );
      })}
    </div>
  );
}
