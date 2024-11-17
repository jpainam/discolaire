"use client";

import { useSearchParams } from "next/navigation";
import { format, subMonths } from "date-fns";
import { MoreVertical } from "lucide-react";

import { useCreateQueryString } from "@repo/hooks/create-query-string";
import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Input } from "@repo/ui/input";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { TransactionStatusSelector } from "~/components/shared/selects/TransactionStatusSelector";
import { useRouter } from "~/hooks/use-router";

export function TransactionHeader() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const { t } = useLocale();

  const router = useRouter();
  const { createQueryString } = useCreateQueryString();

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-col gap-1">
        <Label className="hidden md:block"> {t("from")}</Label>
        <Input
          type="date"
          defaultValue={
            from ? from : format(subMonths(new Date(), 3), "yyyy-MM-dd")
          }
          onChange={(val) => {
            router.push(`?${createQueryString({ from: val.target.value })}`);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="hidden md:block">{t("to")}</Label>
        <Input
          type="date"
          defaultValue={to ? to : format(new Date(), "yyyy-MM-dd")}
          min={from ? from : format(subMonths(new Date(), 3), "yyyy-MM-dd")}
          onChange={(val) => {
            router.push(`?${createQueryString({ to: val.target.value })}`);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label>{t("status")}</Label>
        <TransactionStatusSelector
          onChange={(val) => {
            router.push(`?${createQueryString({ status: val })}`);
          }}
        />
      </div>

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
