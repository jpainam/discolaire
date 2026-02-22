"use client";

import { Fragment, Suspense } from "react";
import Link from "next/link";
import {
  PanelRightOpenIcon,
  SidebarRightIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { NotificationList } from "~/components/notifications/NotificationList";
import { SchoolYearSwitcher } from "~/components/SchoolYearSwitcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { breadcrumbIcons } from "~/icons";
import { useBreadcrumbsStore } from "~/stores/breadcrumbs";
import { useRightPanel } from "./RightPanelProvider";

export function  SiteHeader({ schoolYearId }: { schoolYearId: string }) {
  const breadcrumbs = useBreadcrumbsStore((s) => s.items);
  const { isOpen, toggle } = useRightPanel();
  return (
    <header className="sticky top-0 z-10 flex h-(--header-height) shrink-0 items-center gap-2 rounded-t-xl border-b bg-background transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" />
        <Breadcrumb className="hidden lg:flex">
          <BreadcrumbList>
            {breadcrumbs.map((it, idx) => {
              const last = idx === breadcrumbs.length - 1;
              const Icon = it.icon ? breadcrumbIcons[it.icon] : null;

              return (
                <Fragment key={`${it.label}-${idx}`}>
                  <BreadcrumbItem key={idx}>
                    {it.href && !last ? (
                      <BreadcrumbLink asChild>
                        <Link
                          href={it.href}
                          className="flex items-center gap-1"
                        >
                          {Icon ? (
                            <HugeiconsIcon
                              icon={Icon}
                              strokeWidth={2}
                              className="size-4"
                            />
                          ) : null}
                          {it.label}
                        </Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="flex items-center gap-1">
                        {Icon ? (
                          <HugeiconsIcon
                            icon={Icon}
                            strokeWidth={2}
                            className="size-4"
                          />
                        ) : null}
                        {it.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {!last ? <BreadcrumbSeparator /> : null}
                </Fragment>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<Skeleton className="w-10" />}>
            <SchoolYearSwitcher defaultValue={schoolYearId} />
          </Suspense>
          <LanguageSwitcher className="hidden md:flex" />
          <NotificationList />
          <ModeSwitcher />
          <Button
            variant="ghost"
            size={"icon-xs"}
            onClick={() => {
              toggle();
            }}
          >
            {isOpen ? (
              <HugeiconsIcon
                icon={PanelRightOpenIcon}
                className="size-4"
                //strokeWidth={2}
              />
            ) : (
              <HugeiconsIcon
                className="size-4"
                icon={SidebarRightIcon}
                strokeWidth={2}
              />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
