"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useLocale } from "@repo/i18n";
import { Card, CardContent } from "@repo/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Skeleton } from "@repo/ui/skeleton";

import { EmptyState } from "~/components/EmptyState";
import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";

export function FeeTrend() {
  const feesTrendQuery = api.fee.trend.useQuery();

  const { t } = useLocale();
  const chartConfig = {
    views: {
      label: t("classroom"),
    },
    amount: {
      label: t("amount"),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  if (feesTrendQuery.isPending) {
    return <Skeleton className="h-[100px] w-full" />;
  }
  if (feesTrendQuery.isError) {
    showErrorToast(feesTrendQuery.error);
    throw feesTrendQuery.error;
  }
  if (!feesTrendQuery.data) {
    return <EmptyState />;
  }
  const data = feesTrendQuery.data || [];
  return (
    <Card className="border-none p-2 shadow-none">
      <CardContent className="p-2">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              // tickFormatter={(value) => {
              //   const date = new Date(value);
              //   return date.toLocaleDateString("en-US", {
              //     month: "short",
              //     day: "numeric",
              //   });
              // }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  // labelFormatter={(value) => {
                  //   return new Date(value).toLocaleDateString("en-US", {
                  //     month: "short",
                  //     day: "numeric",
                  //     year: "numeric",
                  //   });
                  // }}
                />
              }
            />
            <Bar dataKey={"amount"} fill={`var(--color-amount)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
