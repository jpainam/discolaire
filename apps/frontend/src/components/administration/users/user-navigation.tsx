"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { routes } from "~/configs/routes";
import { cn } from "~/lib/utils";

export default function UserNavigation() {
  const params = useParams();
  const id = params.id as string;
  const menuItems = [
    {
      label: "My Details",
      value: `${routes.administration.users.details(id)}`,
    },
    {
      label: "Permissions",
      value: `${routes.administration.users.profile(id)}`,
    },
    {
      label: "Password",
      value: `${routes.administration.users.credentials(id)}`,
    },
  ];
  const pathname = usePathname();
  return (
    <div className="relative flex h-[52px] items-start overflow-hidden">
      <div className="-mb-7 flex w-full gap-3 overflow-x-auto scroll-smooth pb-7 md:gap-5 lg:gap-8">
        {menuItems.map((menu, index) => (
          <Link
            href={`${menu.value}`}
            key={`menu-${index}`}
            className={cn(
              "before:bg-gray-1000 group relative cursor-pointer whitespace-nowrap py-2.5 font-medium text-gray-500 before:absolute before:bottom-0 before:left-0 before:z-[1] before:h-0.5 before:transition-all hover:text-gray-900",
              menu.value.toLowerCase() === pathname
                ? "before:visible before:w-full before:opacity-100"
                : "before:invisible before:w-0 before:opacity-0",
            )}
          >
            <span className="inline-flex rounded-md px-2.5 py-1.5 transition-all duration-200 group-hover:bg-gray-100/70">
              {menu.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
