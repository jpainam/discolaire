"use client";

import { MoreVertical } from "lucide-react";
import { useQueryStates } from "nuqs";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";

import { DateRangePicker } from "~/components/DateRangePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { AccountingJournalSelector } from "~/components/shared/selects/AccountingJournalSelector";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TransactionStatusSelector } from "~/components/shared/selects/TransactionStatusSelector";
import { useLocale } from "~/i18n";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionHeader() {
  const { t } = useLocale();

  const [searchParams, setSearchParams] = useQueryStates(
    transactionSearchParamsSchema,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="flex flex-col gap-2">
        <Label className="hidden md:block">{t("Accounting Journals")}</Label>
        <AccountingJournalSelector
          defaultValue={searchParams.journalId ?? undefined}
          onChange={(val) => {
            void setSearchParams({
              journalId: val,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="hidden md:block">{t("classroom")}</Label>
        <ClassroomSelector
          className="w-full md:w-full"
          defaultValue={searchParams.classroomId ?? ""}
          onSelect={(val) => {
            void setSearchParams({
              classroomId: val,
            });
          }}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="hidden md:block">{t("Date range")}</Label>
        <DateRangePicker
          defaultValue={
            searchParams.from && searchParams.to
              ? { from: searchParams.from, to: searchParams.to }
              : undefined
          }
          onSelectAction={(val) => {
            void setSearchParams({
              from: val?.from ?? null,
              to: val?.to ?? null,
            });
          }}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="hidden md:block">{t("status")}</Label>
        <TransactionStatusSelector
          onChange={(val) => {
            void setSearchParams({
              status: val,
            });
          }}
        />
      </div>

      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"} className="size-8" size={"icon"}>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownHelp />
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                window.open(`/api/pdfs/transactions?format=pdf`, "_blank");
              }}
            >
              <PDFIcon />
              {t("pdf_export")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                window.open(`/api/pdfs/transactions?format=csv`, "_blank");
              }}
            >
              <XMLIcon />
              {t("xml_export")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
