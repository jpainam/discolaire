"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { cn } from "~/lib/utils";

export interface TabMenuOption {
  icon: React.ReactNode;
  name: string;
  href: string;
}
export function TabMenu({
  title,
  href,
  icon,
}: {
  title: string;
  href: string;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname.includes(href);
  return (
    <Link href={href} className="relative z-10">
      <div
        className={cn(
          "flex flex-row items-center gap-2 rounded-full px-4 py-1.5 text-sm text-muted-foreground transition-all",
          isActive
            ? "bg-primary text-primary-foreground"
            : "hover:text-secondary-foreground",
        )}
      >
        {icon} {title}
      </div>
      {isActive && (
        <motion.div
          layoutId="indicator"
          className="absolute left-0 top-0 h-full w-full rounded-full bg-primary"
          style={{ zIndex: -1 }}
        />
      )}
    </Link>
  );
}
