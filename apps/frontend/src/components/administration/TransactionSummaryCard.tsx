"use client";
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
import { useSuspenseQuery } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import i18next from "i18next";
import { Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
    })
  );
  const handleChangeRange = (value: string) => {
    switch (value) {
      case "this-month":
        setFrom(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
        setTo(addMonths(new Date(), 1));
        break;
      case "last-month":
        setFrom(
          new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
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
          <div className="flex items-center gap-2.5 mb-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                Total Revenue
              </div>
              <div className="text-2xl font-bold text-foreground">
                {transactionSummary.revenue.toLocaleString(i18next.language, {
                  style: "currency",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                  currency: CURRENCY,
                })}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                Nombre
              </div>
              <div className="text-2xl font-bold text-foreground">
                {transactionSummary.numberOfTransactions}
              </div>
            </div>
          </div>
          {/* Segmented Progress Bar */}
          <div className="flex items-center gap-0.5 w-full h-2.5 rounded-full overflow-hidden mb-3.5 bg-muted">
            <div className="bg-teal-400 h-full" style={{ width: "75%" }} />
            <div className="bg-destructive h-full" style={{ width: "20%" }} />
            <div className="bg-amber-400 h-full" style={{ width: "5%" }} />
          </div>
          {/* Legend */}
          <div className="flex items-center gap-5 mb-6">
            <div className="flex items-center gap-1 text-xs text-teal-600">
              <span className="size-2 rounded-full bg-teal-400 inline-block" />{" "}
              {t("credit")}
            </div>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <span className="size-2 rounded-full bg-destructive inline-block" />{" "}
              {t("debit")}
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <span className="size-2 rounded-full bg-amber-400 inline-block" />{" "}
              {t("discount")}
              <span className="ms-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="size-3.5 text-muted-foreground cursor-pointer" />
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
          <div className="flex items-center justify-between mb-2.5">
            <div className="text-xs text-muted-foreground tracking-wide uppercase">
              Expiring Soon
            </div>
            <a
              href="/administration/accounting/transactions"
              className="text-sm text-primary font-medium hover:underline"
            >
              {t("view_all")}
            </a>
          </div>
          {transactionSummary.lastTransactions.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-muted/40 rounded-md px-3 py-2.5 mb-2 last:mb-0"
            >
              <Link
                target="_blank"
                href={`/students/${item.student.id}/transactions/${item.id}`}
                className="flex items-center gap-2.5 text-xs"
              >
                <span className="text-xs font-medium text-foreground">
                  {item.student.lastName}
                </span>
                <Badge variant={"secondary"} className="text-xs">
                  {item.student.classroom?.reportName}
                </Badge>
              </Link>
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-muted-foreground">
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
