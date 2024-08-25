"use client";

import { useSearchParams } from "next/navigation";
import { ChevronDown, Printer } from "lucide-react";

import { useLocale } from "@repo/i18n";
import { Button } from "@repo/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/ui/dropdown-menu";
import { Label } from "@repo/ui/label";

import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { DateRangePicker } from "../../shared/DateRangePicker";
import { AnnouncementSummary } from "./AnnouncementSummary";

type DateRange = {
  from: Date;
  to: Date;
};

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
        onChange={handleDateRangeChange}
        from={from ? new Date(from) : undefined}
        to={to ? new Date(to) : undefined}
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
              <XMLIcon className="mr-2 h-4 w-4" />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs">
              <PDFIcon className="mr-2 h-4 w-4" />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
