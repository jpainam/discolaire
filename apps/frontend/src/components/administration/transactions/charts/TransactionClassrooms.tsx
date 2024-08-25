"use client";

import React, { useEffect, useMemo } from "react";
import { useLocale } from "@/hooks/use-locale";
import { AppRouter } from "@/server/api/root";
import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Skeleton } from "@repo/ui/skeleton";
import { inferProcedureOutput } from "@trpc/server";
import _ from "lodash";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

type TransactionQuotaProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["transaction"]["quotas"]>
>[number];

export function TransactionClassrooms() {
  const { t } = useLocale();
  const chartConfig = useMemo(() => {
    return {
      revenue: {
        label: t("expected_amount"),
        color: "hsl(var(--chart-2))",
      },
      paid: {
        label: t("received_amount"),
        color: "hsl(var(--chart-1))",
      },
      remaining: {
        label: t("difference"),
        color: "hsl(var(--chart-4))",
      },
    } satisfies ChartConfig;
  }, [t]);

  const transactionsQuotaQuery = api.transaction.quotas.useQuery();

  const [filteredData, setFilteredData] = React.useState<
    TransactionQuotaProcedureOutput[][]
  >([]);

  useEffect(() => {
    if (!transactionsQuotaQuery.data) return;
    const transactions = transactionsQuotaQuery.data;
    const divided = _.chunk(transactions, Math.ceil(transactions.length / 4));
    setFilteredData(divided);
  }, [transactionsQuotaQuery.data]);

  if (transactionsQuotaQuery.isPending) {
    return (
      <div className="flex w-full flex-col">
        <div className="flex w-full flex-row gap-4 p-2">
          <Skeleton className="h-[200px] w-1/3" />
          <Skeleton className="h-[200px] w-2/3" />
        </div>
        <div className="flex w-full flex-row gap-4 p-2">
          <Skeleton className="h-[200px] w-1/3" />
          <Skeleton className="h-[200px] w-2/3" />
        </div>
      </div>
    );
  }
  if (transactionsQuotaQuery.isError) {
    throw transactionsQuotaQuery.error;
  }
  if (!transactionsQuotaQuery.data) return null;

  return (
    <div className="grid w-full items-end gap-8 p-2 md:grid-cols-2">
      {filteredData.map((data, index) => {
        return (
          <Card key={index} className="rounded-sm shadow-none">
            <CardHeader className="p-0">
              <div className="flex flex-1 flex-col px-6 py-2">
                <CardTitle className="text-md">
                  {t("classroom_transaction_quotas")} ({index + 1})
                </CardTitle>
                <CardDescription></CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ChartContainer
                className="h-[300px] w-full p-0"
                config={chartConfig}
              >
                <BarChart accessibilityLayer data={data}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="classroom"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="w-[200px]"
                        indicator="dashed"
                      />
                    }
                  />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={4}
                  />
                  <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
                  <Bar
                    dataKey="remaining"
                    fill="var(--color-remaining)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter> */}
          </Card>
        );
      })}
    </div>
  );
}
