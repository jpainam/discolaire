"use client";

import { usePathname } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";
import { Separator } from "@repo/ui/components/separator";
import { SidebarTrigger } from "@repo/ui/components/sidebar";

import { useLocale } from "~/i18n";
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
          <BreadcrumbList key="breadcrumb-list-admin">
            <BreadcrumbItem key={"dashboard-key"} className="hidden md:block">
              <BreadcrumbLink
                key={"breadcrumb-list-link"}
                href={"/administration"}
              >
                {t("dashboard")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator
              key={"breadcrumb-list-separator"}
              className="hidden md:block"
            />
            {breadcrumbs.map((breadcrumb, index) => (
              <>
                <BreadcrumbItem
                  className="hidden md:block"
                  key={`${breadcrumb.title}-${index}`}
                >
                  <BreadcrumbLink href={breadcrumb.url ?? "#"}>
                    {t(breadcrumb.title)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index != breadcrumbs.length - 1 && (
                  <BreadcrumbSeparator
                    key={`breadcrumb-list-separator-${index}`}
                    className="hidden md:block"
                  />
                )}
              </>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}
