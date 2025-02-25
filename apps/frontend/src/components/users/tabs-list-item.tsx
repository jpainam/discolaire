"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
      className="flex flex-col items-start justify-center hover:rounded-md hover:bg-secondary"
      href={href}
    >
      <div className="flex flex-row items-center gap-2 px-4">
        <div>{icon}</div>
        <div className="flex flex-col">
          <div>{name}</div>
          {isActive && (
            <div
              className={
                "h-1 w-full rounded-t-md border-b-4 border-primary bg-primary"
              }
            ></div>
          )}
        </div>
      </div>
    </Link>
  );
}
