"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@repo/ui/components/card";
import type { ChartConfig } from "@repo/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { useLocale } from "~/i18n";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export function FeeBar() {
  const { t } = useLocale();
  const chartConfig = {
    count: {
      label: t("fees"),
      color: "var(--chart-1)",
    },
    label: {
      color: "hsl(var(--background))",
    },
  } satisfies ChartConfig;
  const trpc = useTRPC();
  const { data: feesMonthly } = useSuspenseQuery(
    trpc.fee.monthly.queryOptions()
  );

  return (
    <Card className="flex w-[350px] flex-col border-none shadow-none">
      <CardContent className="flex-1 p-0">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={feesMonthly}
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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
