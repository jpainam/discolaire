"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAtom } from "jotai";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/breadcrumb";

import { breadcrumbAtom } from "~/lib/atoms";

export const Breadcrumbs = () => {
  const [breadcrumbs, setBreadcrumbs] = useAtom(breadcrumbAtom);
  //const { t } = useLocale();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      setBreadcrumbs([]);
    }
  }, [setBreadcrumbs, pathname]);

  if (breadcrumbs.length === 0) return null;

  return (
    <Breadcrumb className="hidden lg:block">
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index) => (
          <React.Fragment key={breadcrumb.url}>
            {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
            <BreadcrumbItem className="hidden md:block">
              {breadcrumb.url ? (
                <BreadcrumbLink asChild>
                  <Link href={breadcrumb.url}>{breadcrumb.name}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{breadcrumb.name}</BreadcrumbPage>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
