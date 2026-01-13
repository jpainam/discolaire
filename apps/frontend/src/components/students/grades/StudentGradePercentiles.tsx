"use client";

import { useMemo } from "react";
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
import { percentile } from "~/lib/utils";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  grade: {
    label: "Grade",
    color: "var(--chart-1)",
  },
  male: {
    label: "Male",
    color: "var(--chart-2)",
  },
  female: {
    label: "Female",
    color: "var(--chart-4)",
  },
} satisfies ChartConfig;

function computePercentiles(
  grades: number[],
  steps: number[] = [1, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 80, 90, 95, 99],
) {
  const sorted = [...grades].sort((a, b) => a - b);

  return steps.map((p) => ({
    percentile: p,
    value: percentile(sorted, p),
  }));
}
export function StudentGradePercentiles({
  grades,
  males,
  females,
}: {
  grades: number[];
  females: number[];
  males: number[];
}) {
  const filteredData = useMemo(() => {
    const p_grades = computePercentiles(grades);
    const m_grades = computePercentiles(males);
    const f_grades = computePercentiles(females);
    return p_grades.map((p, index) => {
      return {
        date: `p${p.percentile}`,
        grade: p.value,
        male: m_grades[index]?.value,
        female: f_grades[index]?.value,
      };
    });
  }, [grades, females, males]);
  //const filteredData = chartData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Percentiles - Notes</CardTitle>
        <CardDescription>
          Showing total visitors for the last 3 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart
            data={filteredData}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillGrade" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-grade)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-grade)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-male)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-male)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFemale" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-female)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-female)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                return String(value);
              }}
            />
            <YAxis
              hide
              domain={[0, "dataMax"]}
              padding={{ top: 0, bottom: 0 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return String(value);
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="male"
              type="natural"
              fill="url(#fillMale)"
              stroke="var(--color-male)"
              stackId="a"
            />
            <Area
              dataKey="female"
              type="natural"
              fill="url(#fillFemale)"
              stroke="var(--color-female)"
              stackId="a"
            />
            <Area
              dataKey="grade"
              type="natural"
              fill="url(#fillGrade)"
              stroke="var(--color-grade)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
