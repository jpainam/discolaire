"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { toast } from "sonner";

import type { ChartConfig } from "@repo/ui/components/chart";
import { useLocale } from "@repo/i18n";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { EmptyState } from "@repo/ui/components/EmptyState";
import { Skeleton } from "@repo/ui/components/skeleton";

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
    toast.error(feesTrendQuery.error.message);
    return;
  }
  if (!feesTrendQuery.data.length) {
    return <EmptyState />;
  }
  const data = feesTrendQuery.data;
  return (
    <Card className="flex-1 border-none p-2 shadow-none">
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
