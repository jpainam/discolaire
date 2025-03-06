"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { ChartConfig } from "@repo/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import { cn } from "@repo/ui/lib/utils";
import { CalendarDays } from "lucide-react";
import { useLocale } from "~/i18n";
const chartData = [
  { month: "Jan", borrowed: 186, returned: 80 },
  { month: "Fev", borrowed: 305, returned: 200 },
  { month: "Mars", borrowed: 237, returned: 120 },
  { month: "Avril", borrowed: 73, returned: 190 },
  { month: "Mai", borrowed: 209, returned: 130 },
  { month: "Juin", borrowed: 214, returned: 140 },
];

export function MonthlyActivities({ className }: { className?: string }) {
  const { t } = useLocale();
  const chartConfig = {
    borrowed: {
      label: t("borrowed"),
      color: "var(--chart-1)",
    },
    returned: {
      label: t("returned"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;
  return (
    <Card className={cn("p-0 gap-0", className)}>
      <CardHeader className="bg-muted/50 p-4 border-b">
        <CardTitle className="flex flex-row items-center gap-2">
          <CalendarDays />
          {t("monthly_activities")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="borrowed" fill="var(--color-borrowed)" radius={4} />
            <Bar dataKey="returned" fill="var(--color-returned)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
