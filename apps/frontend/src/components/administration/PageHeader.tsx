"use client";

import { usePathname } from "next/navigation";

import { useLocale } from "@repo/i18n";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/breadcrumb";
import { Separator } from "@repo/ui/separator";
import { SidebarTrigger } from "@repo/ui/sidebar";

import { pageHeaderBreadcrumbs } from "./menu";

export function PageHeader() {
  const pathname = usePathname();
  const breadcrumbs: {
    title: string;
    url?: string;
  }[] = pageHeaderBreadcrumbs[pathname] ?? [];
  const { t } = useLocale();

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={"/administration"}>
                {t("dashboard")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            {breadcrumbs.map((breadcrumb, index) => (
              <>
                <BreadcrumbItem
                  className="hidden md:block"
                  key={breadcrumb.title}
                >
                  <BreadcrumbLink href={breadcrumb.url ?? "#"}>
                    {t(breadcrumb.title)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index != breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator className="hidden md:block" />
                )}
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
