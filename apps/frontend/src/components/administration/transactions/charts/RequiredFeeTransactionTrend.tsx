"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";

import type { ChartConfig } from "@repo/ui/components/chart";
import { useLocale } from "@repo/i18n";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { EmptyState } from "@repo/ui/components/EmptyState";
import { Skeleton } from "@repo/ui/components/skeleton";

import { api } from "~/trpc/react";

export function RequiredFeeTransactionTrend() {
  const { t } = useLocale();
  const chartConfig = React.useMemo(() => {
    return {
      transactions: {
        label: "Transactions",
      },
      amount: {
        label: t("amount"),
        color: "hsl(var(--chart-1))",
      },
    } satisfies ChartConfig;
  }, [t]);

  const transactionsTrendQuery = api.transaction.trends.useQuery();

  if (transactionsTrendQuery.isPending) {
    return (
      <div className="flex w-full flex-row gap-4 p-2">
        <Skeleton className="h-[200px] w-2/3" />
        <Skeleton className="h-[200px] w-1/3" />
      </div>
    );
  }
  if (transactionsTrendQuery.isError) {
    toast.error(transactionsTrendQuery.error.message);
    return;
  }
  if (transactionsTrendQuery.data.length === 0) {
    return <EmptyState />;
  }
  const transactions = transactionsTrendQuery.data;
  return (
    <Card className="border-none p-0 shadow-none">
      <CardContent className="p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={transactions}>
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
