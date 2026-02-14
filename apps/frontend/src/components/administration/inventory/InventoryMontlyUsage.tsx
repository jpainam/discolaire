"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

const chartConfig = {
  consumableUsage: {
    label: "Consumables out",
    color: "var(--chart-1)",
  },
  assetAssigned: {
    label: "Assets assigned",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function InventoryMonthlyUsage({ className }: { className?: string }) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.inventoryUsage.monthlySummary.queryOptions());

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("Monthly usage")}</CardTitle>
        <CardDescription>
          {t("Consumption of inventory items over the past 6 months")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillConsumableUsage" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-consumableUsage)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-consumableUsage)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillAssetAssigned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-assetAssigned)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-assetAssigned)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="consumableUsage"
              type="monotone"
              fill="url(#fillConsumableUsage)"
              stroke="var(--color-consumableUsage)"
              strokeWidth={2}
            />
            <Area
              dataKey="assetAssigned"
              type="monotone"
              fill="url(#fillAssetAssigned)"
              stroke="var(--color-assetAssigned)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
