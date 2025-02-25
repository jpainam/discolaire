/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";

import rangeMap from "~/lib/range-map";

const chartData = [
  { month: "January", desktop: 186, mobile: 80, remaining: 60 },
  { month: "February", desktop: 305, mobile: 200, remaining: 20 },
  { month: "March", desktop: 237, mobile: 120, remaining: 30 },
  { month: "April", desktop: 73, mobile: 190, remaining: 50 },
  { month: "May", desktop: 209, mobile: 130, remaining: 20 },
  { month: "June", desktop: 214, mobile: 140, remaining: 10 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export function RequiredFeeClassrooms() {
  return (
    <div className="grid w-full items-end gap-8 p-2 md:grid-cols-2">
      {rangeMap(4, (index) => {
        return (
          <Card
            key={`preq-required-${index}`}
            className="border-none p-0 shadow-none"
          >
            <CardContent className="p-2">
              <ChartContainer
                className="h-[300px] w-full p-0"
                config={chartConfig}
              >
                <BarChart accessibilityLayer data={chartData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        className="w-[200px]"
                        hideLabel={false}
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="desktop"
                    stackId="a"
                    fill="var(--color-desktop)"
                    radius={[0, 0, 4, 4]}
                  />
                  <Bar
                    dataKey="mobile"
                    stackId="a"
                    fill="var(--color-mobile)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="remaining"
                    stackId="a"
                    fill="var(--color-remaining)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
