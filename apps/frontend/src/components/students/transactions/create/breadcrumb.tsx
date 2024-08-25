"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  BreadCrumb,
  BreadCrumbItem,
  BreadCrumbSeparator,
} from "@repo/ui/BreadCrumb";

import { routes } from "~/configs/routes";
import { useLocale } from "~/hooks/use-locale";

export const MakePaymentBreadCrumb = () => {
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
        <Link href={routes.students.transactions.index(params.id)}>
          {t("account")}
        </Link>
      </BreadCrumbItem>
      <BreadCrumbSeparator />
      <BreadCrumbItem className="h-7 px-2" index={2}>
        <Link href={routes.students.transactions.create(params.id)}>
          {t("make_payment")}
        </Link>
      </BreadCrumbItem>
    </BreadCrumb>
  );
};
