"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { routes } from "@/configs/routes";
import { useLocale } from "@/hooks/use-locale";
import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "@repo/ui/BreadCrumb";

export const FinanceBreadCrumb = () => {
  const { t } = useLocale();
  const params = useParams() as { id: string };
  return (
    <BreadCrumb
      orientation="horizontal"
      variant={"ghost"}
      className="gap-1 rounded-lg bg-background px-2"
    >
      <BreadCrumbItem className="h-7 px-2" index={0}>
        <Link href={routes.students.details(params.id)}>{t("students")}</Link>
      </BreadCrumbItem>
      <BreadCrumbSeparator className="" />
      <BreadCrumbItem className="h-7 px-2" index={1}>
        {t("account")}
      </BreadCrumbItem>
      <BreadCrumbSeparator />
      <BreadCrumbItem className="h-7 px-2" index={2}>
        {t("finances")}
      </BreadCrumbItem>
    </BreadCrumb>
  );
};
