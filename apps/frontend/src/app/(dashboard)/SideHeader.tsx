"use client";

import { Suspense } from "react";
import { Home01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";

import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { NotificationList } from "~/components/notifications/NotificationList";
import { SchoolYearSwitcher } from "~/components/SchoolYearSwitcher";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";

export function SiteHeader({ schoolYearId }: { schoolYearId: string }) {
  const t = useTranslations();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-2">
                <HugeiconsIcon icon={Home01Icon} className="size-4" />
                {t("home")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/"> {t("students")}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<Skeleton className="w-10" />}>
            <SchoolYearSwitcher defaultValue={schoolYearId} />
          </Suspense>
          <LanguageSwitcher className="hidden md:flex" />
          <NotificationList />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
