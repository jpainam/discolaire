"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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

import DateRangePicker from "~/components/date-range-picker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TransactionStatusSelector } from "~/components/shared/selects/TransactionStatusSelector";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useRouter } from "~/hooks/use-router";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionHeader() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: journals } = useSuspenseQuery(
    trpc.accountingJournal.all.queryOptions(),
  );

  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const [searchParams] = useQueryStates(transactionSearchParamsSchema);
  const from = searchParams.from ?? undefined;
  const to = searchParams.to ?? undefined;

  return (
    <div className="grid flex-row items-center gap-4 px-4 py-2 md:flex">
      <div className="flex flex-col gap-1">
        <Label className="hidden md:block">{t("Accounting Journals")}</Label>
        <Select
          onValueChange={(val) => {
            router.push(`?${createQueryString({ journalId: val })}`);
          }}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder={t("all")} />
          </SelectTrigger>
          <SelectContent>
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
          className="w-full md:w-[250px]"
          defaultValue={searchParams.classroomId ?? ""}
          onSelect={(val) => {
            router.push(`?${createQueryString({ classroomId: val })}`);
          }}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label className="hidden md:block">{t("Date range")}</Label>
        <DateRangePicker
          defaultValue={
            from && to ? { from: new Date(from), to: new Date(to) } : undefined
          }
          onSelectAction={(val) => {
            if (val?.from && val.to) {
              router.push(
                `?${createQueryString({ from: format(val.from, "yyyy-MM-dd"), to: format(val.to, "yyyy-MM-dd") })}`,
              );
            } else {
              router.push(`?${createQueryString({ from: null, to: null })}`);
            }
          }}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="hidden md:block">{t("status")}</Label>
        <TransactionStatusSelector
          onChange={(val) => {
            router.push(`?${createQueryString({ status: val })}`);
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
