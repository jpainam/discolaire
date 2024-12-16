"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";
import { toast } from "sonner";

import type { ChartConfig } from "@repo/ui/chart";
import { useLocale } from "@repo/i18n";
import { Card, CardContent } from "@repo/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Skeleton } from "@repo/ui/skeleton";

import { api } from "~/trpc/react";

export function FeeBar() {
  const { t } = useLocale();
  const chartConfig = {
    count: {
      label: t("fees"),
      color: "hsl(var(--chart-1))",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;
  const feesMonthlyQuery = api.fee.monthly.useQuery();

  if (feesMonthlyQuery.isPending) {
    return <Skeleton className="h-[200px] w-[350px] p-2" />;
  }
  if (feesMonthlyQuery.isError) {
    toast.error(feesMonthlyQuery.error.message);
    return;
  }

  const data = feesMonthlyQuery.data;
  return (
    <Card className="flex w-[350px] flex-col border-none shadow-none">
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: -20,
            }}
          >
            <XAxis type="number" dataKey="count" hide />
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={5}>
              <LabelList
                dataKey="count"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
                // formatter={(value: number) => {
                //   return moneyFormatter.format(value);
                // }}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
