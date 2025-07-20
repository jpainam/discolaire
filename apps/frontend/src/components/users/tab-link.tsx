"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { cn } from "~/lib/utils";

export function TabLink({
  title,
  href,
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
        {icon} {title}
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
