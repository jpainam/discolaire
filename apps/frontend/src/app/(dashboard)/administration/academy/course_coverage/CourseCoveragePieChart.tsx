"use client";

import { LabelList, Pie, PieChart } from "recharts";

import type { ChartConfig } from "~/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

export const description = "A pie chart with a label list";

const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Completed",
    color: "var(--chart-1)",
  },
  safari: {
    label: "In progress",
    color: "var(--chart-2)",
  },
  firefox: {
    label: "Not started",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function CourseCoveragePieChart() {
  return (
    <div className="flex-1 pb-0">
      <ChartContainer
        config={chartConfig}
        className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-[350px]"
      >
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="visitors" hideLabel />}
          />
          <Pie data={chartData} dataKey="visitors">
            <LabelList
              dataKey="browser"
              width={50}
              className="fill-background"
              stroke="none"
              fontSize={12}
              formatter={(value: keyof typeof chartConfig) =>
                chartConfig[value].label
              }
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
}
