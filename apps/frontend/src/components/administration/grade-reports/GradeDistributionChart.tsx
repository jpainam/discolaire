"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useLocale } from "~/i18n";
import { useTRPC } from "~/trpc/react";

export const description = "A bar chart with a label";

// const chartData = [
//   // { month: "January", desktop: 186 },
//   // { month: "February", desktop: 305 },
//   // { month: "March", desktop: 237 },
//   // { month: "April", desktop: 73 },
//   // { month: "May", desktop: 209 },
//   // { month: "June", desktop: 214 },

//   { name: "A (90-100%)", value: 42 },
//   { name: "B (80-89%)", value: 68 },
//   { name: "C (70-79%)", value: 35 },
//   { name: "D (60-69%)", value: 15 },
//   { name: "F (0-59%)", value: 10 },
// ];

const chartConfig = {
  value: {
    label: "Value",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function GradeDistributionChart() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: chartData } = useSuspenseQuery(
    trpc.gradeSheet.distribution.queryOptions()
  );

  return (
    <ChartContainer config={chartConfig} className="h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={chartData}
        margin={{
          top: 20,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          //tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => [
                `${value.toLocaleString()} ${t("students")}`,
                "",
              ]}
              labelFormatter={(name) => `${t("grade")}: ${name}`}
              //hideLabel
            />
          }
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={8} />
        {/* <LabelList
            position="top"
            offset={12}
            className="fill-foreground"
            fontSize={12}
          /> */}
      </BarChart>
    </ChartContainer>
  );
}
