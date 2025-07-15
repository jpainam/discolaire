"use client";

import { MoreVertical } from "lucide-react";

import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import { Label } from "@repo/ui/components/label";
import { useCreateQueryString } from "~/hooks/create-query-string";
import { useLocale } from "~/i18n";

import { useQueryStates } from "nuqs";
import { DatePicker } from "~/components/DatePicker";
import PDFIcon from "~/components/icons/pdf-solid";
import XMLIcon from "~/components/icons/xml-solid";
import { DropdownHelp } from "~/components/shared/DropdownHelp";
import { ClassroomSelector } from "~/components/shared/selects/ClassroomSelector";
import { TransactionStatusSelector } from "~/components/shared/selects/TransactionStatusSelector";
import { useRouter } from "~/hooks/use-router";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionHeader() {
  const { t } = useLocale();

  const router = useRouter();
  const { createQueryString } = useCreateQueryString();
  const [searchParams] = useQueryStates(transactionSearchParamsSchema);
  const from = searchParams.from ?? undefined;
  const to = searchParams.to ?? undefined;

  return (
    <div className="grid px-4 py-2 flex-row items-center gap-6 md:flex">
      <div className="flex gap-2 items-center">
        <Label className="hidden md:block">{t("classroom")}</Label>
        <ClassroomSelector
          className="w-full md:w-[250px]"
          onChange={(val) => {
            router.push(`?${createQueryString({ classroomId: val })}`);
          }}
        />
      </div>
      <div className="flex gap-2 items-center">
        <Label className="hidden md:block"> {t("from")}</Label>
        <DatePicker
          defaultValue={from}
          onChange={(val) => {
            router.push(
              `?${createQueryString({ from: val?.toLocaleDateString() })}`,
            );
          }}
        />
      </div>
      <div className="flex gap-2 items-center">
        <Label className="hidden md:block">{t("to")}</Label>
        <DatePicker
          defaultValue={to}
          onChange={(val) => {
            router.push(
              `?${createQueryString({ to: val?.toLocaleDateString() })}`,
            );
          }}
        />
      </div>
      <div className="flex gap-2 items-center">
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
