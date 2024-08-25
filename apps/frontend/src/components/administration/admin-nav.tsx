"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@repo/ui/button";
import { LucideIcon } from "lucide-react";

interface NavProps {
  links: {
    title: string;
    label?: string;
    icon: LucideIcon;
    variant?: "default" | "ghost";
    href?: string;
  }[];
}

export function AdminNav({ links }: NavProps) {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "classrooms";
  const activeLink = links.find((link) => link.href?.includes(tab));
  return (
    <div
      //data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href || "#"}
            className={cn(
              buttonVariants({
                variant: link.href === activeLink?.href ? "default" : "ghost",
                size: "sm",
              }),
              link.href === activeLink?.href &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
              "justify-start",
            )}
          >
            <link.icon className="mr-2 h-4 w-4" />
            {link.title}
            {link.label && (
              <span
                className={cn(
                  "ml-auto",
                  link.href === activeLink?.href &&
                    "text-background dark:text-white",
                )}
              >
                {link.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}
