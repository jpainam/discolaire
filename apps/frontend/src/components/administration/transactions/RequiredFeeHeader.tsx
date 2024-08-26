"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useRouter } from "@repo/hooks/use-router";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import FlatBadge from "@repo/ui/FlatBadge";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { RequiredFeeSelector } from "~/components/shared/selects/RequiredFeeSelector";
import { useMoneyFormat } from "~/utils/money-format";

export function RequiredFeeHeader() {
  const { t } = useLocale();
  const router = useRouter();
  const { moneyFormatter } = useMoneyFormat();
  const { createQueryString } = useCreateQueryString();
  const [totals, setTotals] = useState(0);
  const [validated, setValidated] = useState(0);
  const [cancelled, setCancelled] = useState(0);
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
        {t("cancelled")} : {moneyFormatter.format(cancelled)}
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
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
