"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { RouterOutputs } from "@repo/api";
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

type TransactionQuotaProcedureOutput = NonNullable<
  RouterOutputs["transaction"]["quotas"]
>;

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

  const filteredData = useMemo(() => {
    if (!transactionsQuotaQuery.data) return [];
    const transactions = transactionsQuotaQuery.data;
    return _.chunk(transactions, Math.ceil(transactions.length / 4));
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

  return (
    <div className="grid items-end gap-8 md:grid-cols-1">
      {filteredData.map((data, index) => {
        return (
          <Card key={index} className="rounded-sm shadow-none">
            <CardContent className="p-0">
              <ChartContainer
                className="h-[200px] w-full p-0"
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
                  <ChartLegend content={<ChartLegendContent />} />
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
