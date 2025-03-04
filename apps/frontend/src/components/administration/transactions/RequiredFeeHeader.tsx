/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { MoreVertical } from "lucide-react";
import { useState } from "react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import FlatBadge from "~/components/FlatBadge";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { RequiredFeeSelector } from "~/components/shared/selects/RequiredFeeSelector";
import { useRouter } from "~/hooks/use-router";
import { useMoneyFormat } from "~/utils/money-format";

export function RequiredFeeHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const { moneyFormatter } = useMoneyFormat();
  const { createQueryString } = useCreateQueryString();
  const [totals, setTotals] = useState(0);
  const [validated, setValidated] = useState(0);
  const [canceled, setCancelled] = useState(0);
  return (
    <div className="grid flex-row items-center gap-2 p-2 md:flex">
      <Label className="hidden md:flex">{t("type")}</Label>
      <RequiredFeeSelector
        onChange={(val) => {
          router.push("?" + createQueryString({ type: val }));
        }}
        className="md:w-[300px]"
      />
      <Label className="hidden md:flex">{t("classrooms")}</Label>
      <ClassroomSelector
        className="md:w-[300px]"
        onChange={(val) => {
          router.push("?" + createQueryString({ classroom: val }));
        }}
      />
      <FlatBadge variant={"indigo"}>
        {t("totals")} : {moneyFormatter.format(totals)}
      </FlatBadge>
      <FlatBadge variant={"green"}>
        {t("validated")} : {moneyFormatter.format(validated)}
      </FlatBadge>
      <FlatBadge variant={"red"}>
        {t("canceled")} : {moneyFormatter.format(canceled)}
      </FlatBadge>
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
