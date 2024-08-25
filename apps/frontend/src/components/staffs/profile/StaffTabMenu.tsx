"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function StaffTabMenu({
  title,
  href,
  active,
  icon,
}: {
  title: string;
  href: string;
  active?: boolean;
  icon?: React.ReactNode;
}) {
  const pathname = usePathname();
  const isActive = href === pathname;
  return (
    <Link href={href} className="relative z-10">
      <div
        className={cn(
          "rounded-full flex flex-row items-center gap-2 px-4 py-1.5 text-sm text-muted-foreground transition-all",
          isActive
            ? "text-primary-foreground bg-primary"
            : "hover:text-secondary-foreground"
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
