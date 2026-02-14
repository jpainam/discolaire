"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Cell, Pie, PieChart } from "recharts";

import type { ChartConfig } from "~/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { useTRPC } from "~/trpc/react";

export function InventoryPieChart() {
  const trpc = useTRPC();
  const { data: status } = useSuspenseQuery(
    trpc.inventoryUsage.statusOverview.queryOptions(),
  );

  const statusData = [
    {
      name: "available",
      value: status.assetsAvailable,
      fill: "var(--color-available)",
    },
    { name: "inuse", value: status.assetsInUse, fill: "var(--color-inuse)" },
    { name: "lowstock", value: status.lowStock, fill: "var(--color-lowstock)" },
    {
      name: "outofstock",
      value: status.outOfStock,
      fill: "var(--color-outofstock)",
    },
  ];

  const chartConfig = {
    value: {
      label: "Status",
    },
    available: {
      label: "Available assets",
      color: "var(--chart-1)",
    },
    inuse: {
      label: "Assets in use",
      color: "var(--chart-2)",
    },
    lowstock: {
      label: "Low stock",
      color: "var(--chart-3)",
    },
    outofstock: {
      label: "Out of stock",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Item Status Overview</CardTitle>
        <CardDescription>Current inventory status</CardDescription>
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
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
