"use client";

import { Suspense } from "react";

import { Separator } from "@repo/ui/components/separator";
import { SidebarTrigger } from "@repo/ui/components/sidebar";
import { Skeleton } from "@repo/ui/components/skeleton";

import { LanguageSwitcher } from "~/components/LanguageSwitcher";
import { ModeSwitcher } from "~/components/mode-switcher";
import { SchoolYearSwitcher } from "~/components/SchoolYearSwitcher";

export function SiteHeader({ schoolYearId }: { schoolYearId: string }) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Documents</h1>
        <div className="ml-auto flex items-center gap-2">
          <Suspense fallback={<Skeleton className="w-10" />}>
            <SchoolYearSwitcher defaultValue={schoolYearId} />
          </Suspense>

          <LanguageSwitcher className="hidden md:flex" />
          <ModeSwitcher />
        </div>
      </div>
    </header>
  );
}
