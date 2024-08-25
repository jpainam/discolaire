"use client";

import { routes } from "@/configs/routes";
import { useLocale } from "@/hooks/use-locale";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
    <div className="flex text-sm flex-row items-center gap-0">
      {menus?.map((item, index) => {
        const isActive = pathnameKey && item.href.includes(pathnameKey);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "py-2 px-2 items-center bg-transparent hover:bg-secondary hover:border-b-2 border-blue-700 hover:text-foreground",
              isActive ? "bg-secondary text-foreground border-b-2" : ""
            )}
          >
            {t(item.label)}
          </Link>
        );
      })}
    </div>
  );
}
