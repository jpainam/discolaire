"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";

import { cn } from "~/lib/utils";

export function StaffTabMenu({
  title,
  href,
  //active,
  icon,
}: {
  title: string;
  href: string;
  //active?: boolean;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link href={href} className="relative z-10">
      <div
        className={cn(
          "text-muted-foreground flex flex-row items-center gap-2 rounded-full px-4 py-1.5 text-sm transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:text-secondary-foreground",
        )}
      >
        {icon} <span className="hidden lg:block">{title}</span>
      </div>
      {isActive && (
        <motion.div
          layoutId="indicator"
          className="bg-primary absolute top-0 left-0 h-full w-full rounded-full"
          style={{ zIndex: -1 }}
        />
      )}
    </Link>
  );
}
