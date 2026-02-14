"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
  current: {
    label: "Current",
    color: "var(--chart-1)",
  },
  minimum: {
    label: "Minimum",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function InventoryStockLevelSummary({
  className,
}: {
  className?: string;
}) {
  const t = useTranslations();
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.inventoryUsage.stockLevelSummary.queryOptions(),
  );

  const chartData = data.slice(0, 8).map((item) => ({
    name: item.name,
    current: item.currentStock,
    minimum: item.minStockLevel,
  }));

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("Current stock level")}</CardTitle>
        <CardDescription>
          {t("Current stock level compared to minimum level")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="text-muted-foreground text-sm">
            No stock data yet.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-[260px] w-full">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value: string) =>
                  value.length > 12 ? `${value.slice(0, 12)}…` : value
                }
              />
              <YAxis allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="current" fill="var(--color-current)" radius={4} />
              <Bar dataKey="minimum" fill="var(--color-minimum)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
