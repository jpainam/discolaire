"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import SimpleBar from "@/components/simplebar";
import { useCreateQueryString } from "@/hooks/create-query-string";
import { cn } from "@/lib/utils";
import { Badge } from "@repo/ui/badge";

import { SideMenuType } from "./menu-types";

function LinkMenuItem(item: SideMenuType) {
  const { createQueryString } = useCreateQueryString();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "info";
  const isActive = currentTab === item.href;
  const Icon = item.icon;
  return (
    <Link
      data-state={isActive ? "selected" : "false"}
      href="#"
      //href={`${pathname}/?${createQueryString({ tab: item.href })}` ?? "/"}
      className={cn(
        "my-1 flex items-center justify-between rounded-sm border border-solid border-muted px-2 py-2 text-sm duration-200 hover:bg-muted hover:text-muted-foreground data-[state=selected]:bg-muted data-[state=selected]:text-muted-foreground",
      )}
    >
      <div className="flex items-center gap-2 truncate">
        <span>{Icon && <Icon className="h-5 w-5" />}</span>
        <span className="truncate">{item.title}</span>
      </div>
      {item?.badge?.length ? <Badge>{item?.badge} </Badge> : null}
    </Link>
  );
}

type SidebarMenuProps = {
  className?: string;
  simpleBarClassName?: string;
  items: SideMenuType[];
};
export default function SidebarMenu({
  className,
  items,
  simpleBarClassName,
}: SidebarMenuProps) {
  return (
    <div className={cn("mb-7 items-start justify-start", className)}>
      <SimpleBar
        className={cn(
          "[&_.simplebar-content]:flex [&_.simplebar-content]:h-full [&_.simplebar-content]:flex-col [&_.simplebar-content]:justify-start [&_.simplebar-content]:gap-2",
          simpleBarClassName,
        )}
      >
        {items.map((item, index) => {
          return (
            <Fragment key={"fragment-menu" + item.href + "-" + index}>
              <LinkMenuItem {...item} />
            </Fragment>
          );
        })}
      </SimpleBar>
    </div>
  );
}
