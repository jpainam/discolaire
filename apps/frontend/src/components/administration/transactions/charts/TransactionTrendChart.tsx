/* eslint-disable @typescript-eslint/no-unnecessary-condition */
"use client";

import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryStates } from "nuqs";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { Skeleton } from "@repo/ui/components/skeleton";

import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";
import { transactionSearchParamsSchema } from "~/utils/search-params";

export function TransactionTrendChart() {
  const { t } = useLocale();
  const chartConfig = React.useMemo(() => {
    return {
      transactions: {
        label: "Transactions",
      },
      amount: {
        label: t("amount"),
        color: "var(--chart-2)",
      },
    } satisfies ChartConfig;
  }, [t]);

  const [searchParams] = useQueryStates(transactionSearchParamsSchema);
  const trpc = useTRPC();
  const transactionsTrendQuery = useSuspenseQuery(
    trpc.transaction.trends.queryOptions({
      from: searchParams.from,
      to: searchParams.to,
      classroomId: searchParams.classroomId,
      journalId: searchParams.journalId,
    }),
  );

  //const [totalAmount, setTotalAmount] = React.useState(0);

  //const timeRange = searchParams.get("timeRange");
  // const timeRanges = [
  //   { label: t("schoolYear"), value: "All" },
  //   { label: t("last_3_months"), value: "90" },
  //   { label: t("last_30_days"), value: "30" },
  //   { label: t("last_7_days"), value: "7" },
  // ];

  // React.useEffect(() => {
  //   if (!transactionsTrendQuery.data) return;
  //   const transactions = transactionsTrendQuery.data;
  //   const f = transactions.filter((item) => {
  //     if (!timeRange) return true;
  //     const date = new Date(item.date);
  //     const now = new Date();
  //     now.setDate(now.getDate() - Number(timeRange));
  //     return date >= now;
  //   });

  //   setTotalAmount(_.sumBy(f, "amount"));
  //   setFilteredData(f);
  // }, [timeRange, transactionsTrendQuery.data]);
  const data = transactionsTrendQuery.data;
  if (transactionsTrendQuery.isPending) {
    return (
      <div className="flex w-full flex-row gap-4 p-2">
        <Skeleton className="h-[200px] w-2/3" />
        <Skeleton className="h-[200px] w-1/3" />
      </div>
    );
  }
  if (data.length === 0) {
    return (
      <Card className="border-none p-0 shadow-none">
        <CardContent className="p-2">
          <div className="text-muted-foreground flex h-[250px] w-full items-center justify-center">
            {t("no_data")}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none p-0 shadow-none">
      {/* <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 sm:py-2">
          <CardTitle>{t("transaction_summary")}</CardTitle>
          <CardDescription>
            {t("showing_total_transactions_for", {
              timeRange:
                timeRanges.find((item) => item.value == timeRange)?.label ||
                t("schoolYear"),
            })}
          </CardDescription>
        </div>
        <div className="flex">
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-4">
            <span className="text-sm text-muted-foreground">
              {t("transactions")}
            </span>
            <span className="text-lg font-bold leading-none sm:text-xl">
              {moneyFormatter.format(totalAmount)}
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-4">
            <span className="text-sm text-muted-foreground">
              {t("fee_preRequired")}
            </span>
            <span className="text-lg font-bold leading-none sm:text-xl">
              {moneyFormatter.format(totalRequired)}
            </span>
          </div>
          <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6">
            <Select
              defaultValue={timeRange || undefined}
              onValueChange={(val) => {
                router.push(
                  "?" +
                    createQueryString({
                      timeRange: val == "All" ? undefined : val,
                    })
                );
              }}
            >
              <SelectTrigger
                className="w-[160px] rounded-lg sm:ml-auto"
                aria-label={t("select_an_option")}
              >
                <SelectValue placeholder={t("schoolYear")} />
              </SelectTrigger>

              <SelectContent className="rounded-xl">
                {timeRanges.map((item) => (
                  <SelectItem
                    key={item.value}
                    value={item.value}
                    className="rounded-lg"
                  >
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader> */}
      <CardContent className="p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillAmount" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-amount)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  labelFormatter={(value, _payload) => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />

            <Area
              dataKey="amount"
              type="natural"
              fill="url(#fillAmount)"
              stroke="var(--color-amount)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
