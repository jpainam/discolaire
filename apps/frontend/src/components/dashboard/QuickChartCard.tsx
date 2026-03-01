"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "~/components/ui/chart";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { useTRPC } from "~/trpc/react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export const description = "A multiple bar chart";

const chartConfig = {
  max: {
    label: "Max",
    color: "var(--chart-3)",
  },
  average: {
    label: "Moy.",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

export function QuickChartCard() {
  const trpc = useTRPC();
  const { data: latestGradesheet } = useSuspenseQuery(
    trpc.gradeSheet.getLatestGradesheet.queryOptions({ limit: 20 }),
  );
  const t = useTranslations();
  const grades = useMemo(() => {
    const gs = latestGradesheet.map((g) => {
      return {
        name: g.subject.course.shortName,
        max: Math.max(...g.grades.map((grade) => grade.grade)),
        min: Math.min(...g.grades.map((grade) => grade.grade)),
        average: Number(
          (
            g.grades.reduce((acc, grade) => acc + grade.grade, 0) /
            g.grades.length
          ).toFixed(2),
        ),
      };
    });
    return gs.filter((g) => g.max > 0).slice(0, 8);
  }, [latestGradesheet]);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>{t("Recent Grades")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer className="h-75 w-full" config={chartConfig}>
          <BarChart accessibilityLayer data={grades}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              width={4}
              axisLine={false}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis width={25} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="max" fill="var(--color-max)" radius={4} />
            <Bar dataKey="average" fill="var(--color-average)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
