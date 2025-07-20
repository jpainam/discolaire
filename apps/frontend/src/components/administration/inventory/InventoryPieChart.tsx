"use client";

import { Cell, Pie, PieChart } from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";

const statusData = [
  { name: "available", value: 240, fill: "var(--color-available)" },
  { name: "inuse", value: 45, fill: "var(--color-inuse)" },
  { name: "lowstock", value: 15, fill: "var(--color-lowstock)" },
  { name: "needsrepair", value: 8, fill: "var(--color-needsrepair)" },
];

export function InventoryPieChart() {
  const chartConfig = {
    value: {
      label: "Status",
    },
    available: {
      label: "Available",
      color: "var(--chart-1)",
    },
    inuse: {
      label: "In Use",
      color: "var(--chart-2)",
    },
    lowstock: {
      label: "Low Stock",
      color: "var(--chart-3)",
    },
    needsrepair: {
      label: "Needs Repair",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;
  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Item Status Overview</CardTitle>
        <CardDescription>Current status of all inventory items</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] px-0"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="value" hideLabel />}
            />
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              //fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent />} />
            {/* <Tooltip /> */}
            {/* <Legend /> */}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
