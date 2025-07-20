"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useSetAtom } from "jotai";

import { Label } from "@repo/ui/components/label";

import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { breadcrumbAtom } from "~/lib/atoms";
import { useTRPC } from "~/trpc/react";
import { getFullName } from "~/utils";
import { StaffSelector } from "../shared/selects/StaffSelector";

export function StaffDetailHeader() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: staffs } = useSuspenseQuery(trpc.staff.all.queryOptions());
  const params = useParams<{ id: string }>();

  const router = useRouter();
  const setBreadcrumbs = useSetAtom(breadcrumbAtom);
  useEffect(() => {
    const staff = staffs.find((c) => c.id === params.id);
    const breads = [
      { name: t("home"), url: "/" },
      { name: t("staffs"), url: "/staffs" },
    ];
    if (staff) {
      breads.push({ name: getFullName(staff), url: `/staffs/${staff.id}` });
    }
    setBreadcrumbs(breads);
  }, [staffs, params.id, setBreadcrumbs, t]);

  return (
    <div className="grid flex-row items-center justify-between gap-4 px-4 py-1 lg:flex">
      <div className="flex w-full flex-row items-center gap-2">
        <Label className="hidden md:block">{t("staffs")}</Label>
        <StaffSelector
          className="w-full lg:w-1/2 2xl:w-[350px]"
          onChange={(val) => {
            router.push(`/staffs/${val}`);
          }}
        />
      </div>
    </div>
  );
}
