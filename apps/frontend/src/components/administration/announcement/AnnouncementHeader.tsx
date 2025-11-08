/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSearchParams } from "next/navigation";
import { ChevronDown, Printer } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import { DateRangePicker } from "~/components/DateRangePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { AnnouncementSummary } from "./AnnouncementSummary";

interface DateRange {
  from: Date;
  to: Date;
}

function isValidDateRange(range: any): range is DateRange {
  return range && range.from instanceof Date && range.to instanceof Date;
}

export function AnnouncementHeader() {
  const { t } = useLocale();
  const { createQueryString } = useCreateQueryString();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const router = useRouter();

  const handleDateRangeChange = (range: any) => {
    if (isValidDateRange(range)) {
      router.push(
        "?" +
          createQueryString({
            from: range.from.toISOString(),
            to: range.to.toISOString(),
          }),
      );
    } else {
      router.push(
        "?" +
          createQueryString({
            from: undefined,
            to: undefined,
          }),
      );
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-2">
      <Label>{t("date")}</Label>
      <DateRangePicker
        onSelectAction={handleDateRangeChange}
        //defaultValue={from: from ? new Date(from) : undefined, to: to ? new Date(to) : undefined}
      />

      <AnnouncementSummary />
      <div className="ml-auto flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="flex flex-row items-center gap-1"
            >
              <Printer className="h-3 w-3" />
              <span className="text-xs">{t("print")}</span>
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-xs">
              <XMLIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <PDFIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
