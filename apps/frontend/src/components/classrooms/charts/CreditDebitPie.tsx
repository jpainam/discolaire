"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";

import { Card, CardContent } from "@repo/ui/components/card";
import type { ChartConfig } from "@repo/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { useLocale } from "~/i18n";

const chartData = [
  { type: "credit", count: 275, fill: "var(--color-credit)" },
  { type: "debit", count: 200, fill: "var(--color-debit)" },
];

export function CreditDebitPie() {
  const { t } = useLocale();
  const chartConfig = {
    count: {
      label: t("count"),
    },
    credit: {
      label: "Credit",
      color: "hsl(var(--chart-1))",
    },
    debit: {
      label: "Debit",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col border-none shadow-none">
      <CardContent className="p-0">
        <ChartContainer className="max-h-[120px]" config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="type"
              type="category"
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig].label
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="count" barSize={20} layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
