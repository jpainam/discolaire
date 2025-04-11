"use client";

import _ from "lodash";
import React, { useEffect, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";

import type { RouterOutputs } from "@repo/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { ChartConfig } from "@repo/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useLocale } from "~/i18n";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

type TransactionQuotaProcedureOutput = NonNullable<
  RouterOutputs["transaction"]["quotas"]
>[number];

export function TransactionClassrooms() {
  const { t } = useLocale();
  const chartConfig = useMemo(() => {
    return {
      revenue: {
        label: t("expected_amount"),
        color: "var(--chart-2)",
      },
      paid: {
        label: t("received_amount"),
        color: "var(--chart-1)",
      },
      remaining: {
        label: t("difference"),
        color: "var(--chart-4)",
      },
    } satisfies ChartConfig;
  }, [t]);

  const trpc = useTRPC();
  const transactionsQuotaQuery = useQuery(
    trpc.transaction.quotas.queryOptions(),
  );

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
        <div className="flex w-full flex-row gap-4">
          <Skeleton className="h-[200px] w-1/3" />
          <Skeleton className="h-[200px] w-2/3" />
        </div>
        <div className="flex w-full flex-row gap-4">
          <Skeleton className="h-[200px] w-1/3" />
          <Skeleton className="h-[200px] w-2/3" />
        </div>
      </div>
    );
  }
  if (transactionsQuotaQuery.isError) {
    toast.error(transactionsQuotaQuery.error.message);
    return;
  }

  return (
    <div className="grid items-end gap-8 md:grid-cols-2">
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
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
