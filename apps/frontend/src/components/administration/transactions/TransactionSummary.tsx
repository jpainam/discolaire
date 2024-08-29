"use client";

import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import { useQueryState } from "nuqs";

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
import { DateRangePicker } from "~/components/shared/DateRangePicker";
import { TransactionStatusSelector } from "~/components/shared/selects/TransactionStatusSelector";
import { api } from "~/trpc/react";
import { useMoneyFormat } from "../../../utils/money-format";

export function TransactionSummary() {
  const [status, setStatus] = useQueryState("status");
  const [from, setFrom] = useQueryState("from");
  const [to, setTo] = useQueryState("to");
  const { t } = useLocale();
  const [totals, setTotals] = useState(0);
  const [validated, setValidated] = useState(0);
  const [cancelled, setCancelled] = useState(0);

  const transactionsQuery = api.transaction.all.useQuery({
    status: status ?? undefined,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  useEffect(() => {
    if (!transactionsQuery.data) return;
    const transactions = transactionsQuery.data;
    setTotals(transactions.reduce((acc, curr) => acc + curr.amount, 0));
    setValidated(
      transactions.reduce(
        (acc, curr) => acc + (curr.status == "VALIDATED" ? curr.amount : 0),
        0,
      ),
    );
    setCancelled(
      transactions.reduce(
        (acc, curr) => acc + (curr.status == "CANCELLED" ? curr.amount : 0),
        0,
      ),
    );
  }, [from, to, transactionsQuery.data]);
  const { moneyFormatter } = useMoneyFormat();

  return (
    <div className="flex flex-row items-center gap-2 p-2">
      <Label> {t("date")}</Label>
      <DateRangePicker
        from={from ? new Date(from) : undefined}
        to={to ? new Date(to) : undefined}
        onChange={(val) => {
          if (val) {
            const dateRange = val;
            void setFrom(dateRange.from?.toISOString() ?? null);
            void setTo(dateRange.to?.toISOString() ?? null);
          }
        }}
      />
      <Label>{t("status")}</Label>
      <TransactionStatusSelector
        onChange={(val) => {
          void setStatus(val);
        }}
      />

      {/* {from ||
        (to && (
          <Label>
            {from && fullDateFormatter.format(new Date(from))} -{" "}
            {to && fullDateFormatter.format(new Date(to))}
          </Label>
        ))} */}

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
