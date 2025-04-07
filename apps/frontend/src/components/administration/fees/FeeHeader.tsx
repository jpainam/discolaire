"use client";

import { MoreVertical, Plus } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import type { RouterOutputs } from "@repo/api";
import i18next from "i18next";
import { useEffect, useState } from "react";
import { CreateEditFee } from "~/components/classrooms/fees/CreateEditFee";
import FlatBadge from "~/components/FlatBadge";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { useModal } from "~/hooks/use-modal";
import { useRouter } from "~/hooks/use-router";
import { useSchool } from "~/providers/SchoolProvider";

export function FeeHeader({ fees }: { fees: RouterOutputs["fee"]["all"] }) {
  const { t } = useLocale();
  const router = useRouter();
  const { school } = useSchool();

  const searchParams = useSearchParams();
  const classroomId = searchParams.get("classroomId");
  const { createQueryString } = useCreateQueryString();
  const { openModal } = useModal();

  const [sums, setSums] = useState<{ total: number; required: number }>({
    total: 0,
    required: 0,
  });

  useEffect(() => {
    let filteredFees = [...fees];
    if (classroomId) {
      filteredFees = fees.filter((fee) => fee.classroomId === classroomId);
    }
    const total = filteredFees.reduce((acc, fee) => acc + fee.amount, 0);
    const required = filteredFees
      .filter((f) => f.isRequired)
      .reduce((acc, fee) => acc + fee.amount, 0);
    setSums({ total, required });
  }, [classroomId, fees]);

  return (
    <div className="flex flex-row items-center gap-4 px-4 border-b py-1">
      <Label>{t("classrooms")}</Label>
      <ClassroomSelector
        className="w-full md:w-[300px]"
        defaultValue={classroomId ?? ""}
        onChange={(val) => {
          router.push("?" + createQueryString({ classroomId: val }));
        }}
      />
      <div className="flex flex-row items-center gap-2">
        <FlatBadge variant={"green"}>
          {t("total_fees")}:{" "}
          {sums.total.toLocaleString(i18next.language, {
            style: "currency",
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
            currency: school.currency,
          })}
        </FlatBadge>
        <FlatBadge variant={"pink"}>
          {t("required_fees")}:{" "}
          {sums.required.toLocaleString(i18next.language, {
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
