"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { Label } from "~/components/ui/label";
import { useRouter } from "~/hooks/use-router";
import { StaffSelector } from "../shared/selects/StaffSelector";

export function StaffDetailHeader() {
  const t = useTranslations();

  const params = useParams<{ id: string }>();

  const router = useRouter();

  return (
    <div className="grid flex-row items-center justify-between gap-4 px-4 py-1 lg:flex">
      <div className="flex w-full flex-row items-center gap-2">
        <Label className="hidden md:block">{t("staffs")}</Label>
        <StaffSelector
          className="w-full lg:w-1/2 2xl:w-[350px]"
          defaultValue={params.id}
          onSelect={(val) => {
            router.push(`/staffs/${val}`);
          }}
        />
      </div>
    </div>
  );
}
