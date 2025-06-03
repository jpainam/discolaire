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
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function GradeDistributionChart() {
  const { t } = useLocale();
  const trpc = useTRPC();
  const { data: gradesheets } = useSuspenseQuery(
    trpc.gradeSheet.all.queryOptions()
  );

  const counters: Record<number, number> = {};
  for (let i = 0; i <= 20; i++) {
    counters[i] = 0;
  }
  for (const entry of gradesheets) {
    const { scale, grades } = entry;
    for (const raw of grades) {
      let scaled = (raw.grade / scale) * 20;
      if (scaled > 20) {
        scaled = 20;
      } else if (scaled < 0) {
        scaled = 0;
      }
      const bin = scaled === 20 ? 20 : Math.floor(scaled);
      const b = counters[bin] ?? 0;
      counters[bin] = b + 1;
    }
  }

  const chartData: { name: string; value: number }[] = Object.entries(counters)
    // Optionally sort by numeric key:
    .sort(([aKey], [bKey]) => Number(aKey) - Number(bKey))
    .map(([key, val]) => ({
      name: key,
      value: val,
    }));

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
