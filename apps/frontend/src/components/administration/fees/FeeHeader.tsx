"use client";

import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreVertical, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import { CreateEditFee } from "~/components/classrooms/fees/CreateEditFee";
import FlatBadge from "~/components/FlatBadge";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { useSchool } from "~/providers/SchoolProvider";
import { useTRPC } from "~/trpc/react";

export function FeeHeader() {
  const trpc = useTRPC();
  const { data: fees } = useSuspenseQuery(trpc.fee.all.queryOptions());

  const t = useTranslations();
  const router = useRouter();
  const { school } = useSchool();

  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroomId");
  const { createQueryString } = useCreateQueryString();
  const { openModal } = useModal();

  const filteredFees = classroomId
    ? fees.filter((fee) => fee.classroomId === classroomId)
    : [...fees];

  const sums = {
    total: filteredFees.reduce((acc, fee) => acc + fee.amount, 0),
    required: 0,
  };
  const locale = useLocale();

  return (
    <div className="flex flex-row items-center gap-4 border-b px-4 py-1">
      <Label className="hidden md:block">{t("classrooms")}</Label>
      <ClassroomSelector
        className="w-full md:w-[300px]"
        defaultValue={classroomId ?? ""}
        onSelect={(val) => {
          router.push("?" + createQueryString({ classroomId: val }));
        }}
      />
      <div className="flex flex-row items-center gap-2">
        <FlatBadge variant={"green"}>
          {t("total_fees")}:{" "}
          {sums.total.toLocaleString(locale, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: school.currency,
          })}
        </FlatBadge>
        <FlatBadge variant={"pink"}>
          {t("required_fees")}:{" "}
          {sums.required.toLocaleString(locale, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: school.currency,
          })}
        </FlatBadge>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {classroomId && (
          <Button
            size={"sm"}
            onClick={() => {
              if (!classroomId) return;
              openModal({
                title: t("add"),
                view: <CreateEditFee classroomId={classroomId} />,
              });
            }}
            variant={"default"}
          >
            <Plus />
            {t("add")}
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon />
              {t("export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon />
              {t("export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
