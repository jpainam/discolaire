"use client";

import { useId, useState } from "react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import { Badge } from "@repo/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ChartContainer, ChartTooltip } from "@repo/ui/components/chart";
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group";

import { CustomTooltipContent } from "../../charts-extra";

const mrrData = [
  { month: "Jan 2025", actual: 300000, projected: 120000 },
  { month: "Feb 2025", actual: 420000, projected: 180000 },
  { month: "Mar 2025", actual: 500000, projected: 90000 },
  { month: "Apr 2025", actual: 630000, projected: 110000 },
  { month: "May 2025", actual: 710000, projected: 120000 },
  { month: "Jun 2025", actual: 800000, projected: 100000 },
  { month: "Jul 2025", actual: 900000, projected: 140000 },
  { month: "Aug 2025", actual: 1010000, projected: 120000 },
  { month: "Sep 2025", actual: 1090000, projected: 130000 },
  { month: "Oct 2025", actual: 1180000, projected: 110000 },
  { month: "Nov 2025", actual: 1280000, projected: 130000 },
  { month: "Dec 2025", actual: 1380000, projected: 100000 },
];

const arrData = [
  { month: "Jan 2025", actual: 3600000, projected: 1440000 },
  { month: "Feb 2025", actual: 4200000, projected: 1800000 },
  { month: "Mar 2025", actual: 5000000, projected: 900000 },
  { month: "Apr 2025", actual: 6300000, projected: 1100000 },
  { month: "May 2025", actual: 7100000, projected: 1200000 },
  { month: "Jun 2025", actual: 8000000, projected: 1000000 },
  { month: "Jul 2025", actual: 9000000, projected: 1400000 },
  { month: "Aug 2025", actual: 10100000, projected: 1200000 },
  { month: "Sep 2025", actual: 10900000, projected: 1300000 },
  { month: "Oct 2025", actual: 11800000, projected: 1100000 },
  { month: "Nov 2025", actual: 12800000, projected: 1300000 },
  { month: "Dec 2025", actual: 16560000, projected: 1200000 },
];

const chartConfig = {
  actual: {
    label: "Actual",
    color: "var(--chart-1)",
  },
  projected: {
    label: "Projected",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function Chart01() {
  const id = useId();
  const [selectedValue, setSelectedValue] = useState("off");

  const chartData = selectedValue === "on" ? arrData : mrrData;

  const firstMonth = chartData[0]?.month;
  const lastMonth = chartData[chartData.length - 1]?.month;

  return (
    <Card className=" ">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <div className="space-y-0.5">
            <CardTitle>Test 1 </CardTitle>
            <div className="flex items-start gap-2">
              <div className="text-2xl font-semibold">
                {selectedValue === "off" ? "$1,439,346" : "$8,272,152"}
              </div>
              <Badge className="mt-1.5 border-none bg-emerald-500/24 text-emerald-500">
                {selectedValue === "off" ? "+48.1%" : "+52.7%"}
              </Badge>
            </div>
          </div>
          <div className="inline-flex h-7 shrink-0 rounded-lg bg-black/50 p-0.5">
            <RadioGroup
              value={selectedValue}
              onValueChange={setSelectedValue}
              className="group after:border-border after:bg-background has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 relative inline-grid grid-cols-[1fr_1fr] items-center gap-0 text-xs font-medium after:absolute after:inset-y-0 after:w-1/2 after:rounded-md after:border after:shadow-xs after:transition-[translate,box-shadow] after:duration-300 after:[transition-timing-function:cubic-bezier(0.16,1,0.3,1)] has-focus-visible:after:ring-[3px] data-[state=off]:after:translate-x-0 data-[state=on]:after:translate-x-full"
              data-state={selectedValue}
            >
              <label className="group-data-[state=on]:text-muted-foreground/50 relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-2 whitespace-nowrap transition-colors select-none">
                MRR
                <RadioGroupItem
                  id={`${id}-1`}
                  value="off"
                  className="sr-only"
                />
              </label>
              <label className="group-data-[state=off]:text-muted-foreground/50 relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-2 whitespace-nowrap transition-colors select-none">
                ARR
                <RadioGroupItem id={`${id}-2`} value="on" className="sr-only" />
              </label>
            </RadioGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[var(--chart-1)]/15"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            maxBarSize={20}
            margin={{ left: -12, right: 12, top: 12 }}
          >
            <defs>
              <linearGradient id={`${id}-gradient`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-1)" />
                <stop offset="100%" stopColor="var(--chart-2)" />
              </linearGradient>
            </defs>
            <CartesianGrid
              vertical={false}
              strokeDasharray="2 2"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={12}
              ticks={[firstMonth ?? "", lastMonth ?? ""]}
              stroke="var(--border)"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                value === 0 ? "$0" : `$${(value / 1000000).toFixed(1)}M`
              }
            />
            <ChartTooltip
              content={
                <CustomTooltipContent
                  colorMap={{
                    actual: "var(--chart-1)",
                    projected: "var(--chart-3)",
                  }}
                  labelMap={{
                    actual: "Actual",
                    projected: "Projected",
                  }}
                  dataKeys={["actual", "projected"]}
                  valueFormatter={(value) => `$${value.toLocaleString()}`}
                />
              }
            />
            <Bar dataKey="actual" fill={`url(#${id}-gradient)`} stackId="a" />
            <Bar
              dataKey="projected"
              fill="var(--color-projected)"
              stackId="a"
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
