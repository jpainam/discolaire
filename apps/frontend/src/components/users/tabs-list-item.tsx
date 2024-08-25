"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export function TabListItem({
  icon,
  name,
  href,
}: {
  icon: React.ReactNode;
  name: string;
  href: string;
}) {
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link
      className="flex hover:bg-secondary hover:rounded-md items-start justify-center flex-col"
      href={href}
    >
      <div className="flex px-4 items-center flex-row gap-2">
        <div>{icon}</div>
        <div className="flex flex-col">
          <div>{name}</div>
          {isActive && (
            <div
              className={
                "border-b-4 bg-primary border-primary rounded-t-md w-full h-1"
              }
            ></div>
          )}
        </div>
      </div>
    </Link>
  );
}
