"use client";

import { useParams } from "next/navigation";

import { useLocale } from "@repo/i18n";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@repo/ui/breadcrumb";

import { routes } from "~/configs/routes";

export const FinanceBreadCrumb = () => {
  const { t } = useLocale();
  const params = useParams<{ id: string }>();
  return (
    <Breadcrumb>
      {" "}
      <BreadcrumbList>
        <BreadcrumbLink
          href={routes.students.details(params.id)}
          className="h-7 px-2"
        >
          {t("students")}
        </BreadcrumbLink>
        <BreadcrumbSeparator className="" />
        <BreadcrumbItem className="h-7 px-2">{t("account")}</BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="h-7 px-2">{t("finances")}</BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
};
