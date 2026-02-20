"use client";

import { useSearchParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { MoreVertical, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { Badge } from "~/components/base-badge";
import { CreateEditFee } from "~/components/classrooms/fees/CreateEditFee";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Label } from "~/components/ui/label";
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
        className="w-full xl:w-1/3"
        defaultValue={classroomId ?? ""}
        onSelect={(val) => {
          router.push("?" + createQueryString({ classroomId: val }));
        }}
      />
      <div className="flex flex-row items-center gap-2">
        <Badge variant={"success"} appearance={"outline"}>
          {t("total_fees")}:{" "}
          {sums.total.toLocaleString(locale, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: school.currency,
          })}
        </Badge>
        <Badge variant={"info"} appearance={"outline"}>
          {t("required_fees")}:{" "}
          {sums.required.toLocaleString(locale, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: school.currency,
          })}
        </Badge>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {classroomId && (
          <Button
            size={"sm"}
            onClick={() => {
              if (!classroomId) return;
              openModal({
                title: t("add"),
                description: `${t("fees")}`,
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
            <Button variant={"outline"} size={"icon"}>
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
