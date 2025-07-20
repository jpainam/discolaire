"use client";

import { useState } from "react";
import Link from "next/link";
import { useSuspenseQuery } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import i18next from "i18next";
import { Info } from "lucide-react";

import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/tooltip";

import { useLocale } from "~/i18n";
import { CURRENCY } from "~/lib/constants";
import { useTRPC } from "~/trpc/react";

export function TransactionSummaryCard({
  startDate,
  endDate,
}: {
  startDate: Date;
  endDate: Date;
}) {
  const [from, setFrom] = useState<Date>(startDate);
  const [to, setTo] = useState<Date>(endDate);
  const { t } = useLocale();

  const trpc = useTRPC();
  const { data: transactionSummary } = useSuspenseQuery(
    trpc.transaction.getTransactionSummary.queryOptions({
      from,
      to,
    }),
  );
  const handleChangeRange = (value: string) => {
    switch (value) {
      case "this-month":
        setFrom(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        setTo(addMonths(new Date(), 1));
        break;
      case "last-month":
        setFrom(
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        );
        setTo(new Date(new Date().getFullYear(), new Date().getMonth(), 0));
        break;
      case "this-year":
        setFrom(new Date(new Date().getFullYear(), 0, 1));
        setTo(addMonths(new Date(), 12));
        break;
      case "last-year":
        setFrom(new Date(new Date().getFullYear() - 1, 0, 1));
        setTo(new Date(new Date().getFullYear() - 1, 11, 31));
        break;
      default:
        break;
    }
  };
  return (
    <div className="flex">
      <Card className="w-full">
        <CardHeader className="border-0">
          <CardTitle>Transactions</CardTitle>
          <CardAction>
            <Select defaultValue="this-month" onValueChange={handleChangeRange}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="this-month">This Month</SelectItem>
                <SelectItem value="last-month">Last Month</SelectItem>
                <SelectItem value="this-year">This Year</SelectItem>
                <SelectItem value="last-year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </CardAction>
        </CardHeader>
        <CardContent>
          {/* Stats Row */}
          <div className="mb-4 flex items-center gap-2.5">
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Total Revenue
              </div>
              <div className="text-foreground text-2xl font-bold">
                {transactionSummary.revenue.toLocaleString(i18next.language, {
                  style: "currency",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  currency: CURRENCY,
                })}
              </div>
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <div className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                Nombre
              </div>
              <div className="text-foreground text-2xl font-bold">
                {transactionSummary.numberOfTransactions}
              </div>
            </div>
          </div>
          {/* Segmented Progress Bar */}
          <div className="bg-muted mb-3.5 flex h-2.5 w-full items-center gap-0.5 overflow-hidden rounded-full">
            <div className="h-full bg-teal-400" style={{ width: "75%" }} />
            <div className="bg-destructive h-full" style={{ width: "20%" }} />
            <div className="h-full bg-amber-400" style={{ width: "5%" }} />
          </div>
          {/* Legend */}
          <div className="mb-6 flex items-center gap-5">
            <div className="flex items-center gap-1 text-xs text-teal-600">
              <span className="inline-block size-2 rounded-full bg-teal-400" />{" "}
              {t("credit")}
            </div>
            <div className="text-destructive flex items-center gap-1 text-xs">
              <span className="bg-destructive inline-block size-2 rounded-full" />{" "}
              {t("debit")}
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <span className="inline-block size-2 rounded-full bg-amber-400" />{" "}
              {t("discount")}
              <span className="ms-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground size-3.5 cursor-pointer" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>
                        Enterprise plans are custom contracts with premium
                        support.
                      </span>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </span>
            </div>
          </div>
          {/* Expiring Soon List */}
          <div className="mb-2.5 flex items-center justify-between">
            <div className="text-muted-foreground text-xs tracking-wide uppercase">
              Expiring Soon
            </div>
            <a
              href="/administration/accounting/transactions"
              className="text-primary text-sm font-medium hover:underline"
            >
              {t("view_all")}
            </a>
          </div>
          {transactionSummary.lastTransactions.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-muted/40 mb-2 flex items-center justify-between rounded-md px-3 py-2.5 last:mb-0"
            >
              <Link
                target="_blank"
                href={`/students/${item.student.id}/transactions/${item.id}`}
                className="flex items-center gap-2.5 text-xs"
              >
                <span className="text-foreground text-xs font-medium">
                  {item.student.lastName}
                </span>
                <Badge variant={"secondary"} className="text-xs">
                  {item.student.classroom?.reportName}
                </Badge>
              </Link>
              <div className="flex items-center gap-2.5">
                <span className="text-muted-foreground text-xs">
                  {item.createdAt.toLocaleDateString(i18next.language, {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                  })}
                </span>
                {/* <Separator
                  orientation="vertical"
                  className="h-3 bg-accent-foreground/20"
                />
                <a
                  href={`/students/${item.student.id}/transactions/${item.id}`}
                  className="text-xs text-primary font-medium hover:underline"
                >
                  Renew
                </a> */}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
