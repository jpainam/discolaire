"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "~/trpc/react";

export const description = "A line chart with dots";

const chartConfig = {
  average: {
    label: "Average",
    color: "var(--chart-2)",
  },
  top_10: {
    label: "Top 10%",
    color: "var(--chart-3)",
  },
  bottom_10: {
    label: "Bottom 10%",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function StudentPerformanceChart() {
  const trpc = useTRPC();
  const { data: percentiles } = useSuspenseQuery(
    trpc.gradeSheet.allPercentile.queryOptions()
  );
  console.log(percentiles);
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={percentiles}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="term"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => (value as string).slice(0, 6)}
        />
        <YAxis domain={[40, 100]} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Line
          dataKey="top_10"
          type="monotone"
          stroke="var(--color-top_10)"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          type="monotone"
          dataKey="average"
          stroke="var(--color-average)"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
        <Line
          dataKey="bottom_10"
          type="monotone"
          stroke="var(--color-bottom_10)"
          strokeWidth={2}
          dot={{ r: 4 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
