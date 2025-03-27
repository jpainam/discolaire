"use client";

import { Bar, BarChart, XAxis } from "recharts";

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
import { useLocale } from "~/i18n";

export function LatestGradesheet({
  grades,
}: {
  grades?: {
    name: string;
    min: number;
    max: number;
    average: number;
  }[];
}) {
  const { t } = useLocale();
  const chartConfig = {
    min: {
      label: "Min",
      color: "var(--chart-1)",
    },
    max: {
      label: "Max",
      color: "var(--chart-2)",
    },
    average: {
      label: "Moy.",
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("latest_grades")}</CardTitle>
        {/* <CardDescription>
          Default tooltip with ChartTooltipContent.
        </CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-60 w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={grades}>
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value: string) => {
                return value.slice(0, 3).toUpperCase();
              }}
            />
            <Bar
              dataKey="average"
              stackId="a"
              fill="var(--color-average)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="max"
              stackId="a"
              fill="var(--color-max)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="min"
              stackId="a"
              fill="var(--color-min)"
              radius={[4, 4, 0, 0]}
            />

            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
