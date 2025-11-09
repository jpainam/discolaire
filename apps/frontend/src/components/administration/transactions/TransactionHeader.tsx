"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";

import { DateRangePicker } from "~/components/DateRangePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TransactionStatusSelector } from "~/components/shared/selects/TransactionStatusSelector";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionHeader() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: journals } = useSuspenseQuery(
    trpc.accountingJournal.all.queryOptions(),
  );

  const [searchParams, setSearchParams] = useQueryStates(
    transactionSearchParamsSchema,
  );

  return (
    <div className="grid gap-4 lg:grid-cols-5">
      <div className="flex flex-col gap-1">
        <Label className="hidden md:block">{t("Accounting Journals")}</Label>
        <Select
          onValueChange={(val) => {
            void setSearchParams({
              journalId: val,
            });
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t("all")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("all")}</SelectItem>
            {journals.map((journal) => (
              <SelectItem key={journal.id} value={journal.id}>
                {journal.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
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
      <div className="flex flex-col gap-1">
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

      <div className="flex flex-col gap-1">
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
