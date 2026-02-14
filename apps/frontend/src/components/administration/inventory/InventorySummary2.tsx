"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { useTRPC } from "~/trpc/react";
import { InventoryPieChart } from "./InventoryPieChart";

const chartConfig = {
  stockIn: {
    label: "stockIn",
    color: "var(--chart-1)",
  },
  stockOut: {
    label: "stockOut",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function InventorySummary2() {
  const trpc = useTRPC();
  const { data: chartData } = useSuspenseQuery(
    trpc.inventoryUsage.monthlySummary.queryOptions(),
  );

  return (
    <>
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Stock Movement</CardTitle>
          <CardDescription>
            Monthly stock entries and withdrawals over the last 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[350px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => String(value).slice(0, 3)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dashed" />}
              />
              <Bar dataKey="stockIn" fill="var(--color-stockIn)" radius={4} />
              <Bar dataKey="stockOut" fill="var(--color-stockOut)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <InventoryPieChart />
    </>
  );
}
