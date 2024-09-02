"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartConfig } from "@repo/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { Skeleton } from "@repo/ui/skeleton";

import { api } from "~/trpc/react";

const chartConfig = {
  effectif: {
    label: "Effectif",
    color: "hsl(var(--chart-2))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function ClassroomLevelEffectif() {
  const classroomLevelCountQuery = api.classroomLevel.count.useQuery();
  if (classroomLevelCountQuery.isPending) {
    return <Skeleton className="h-full w-full" />;
  }
  const chartData = classroomLevelCountQuery.data;
  return (
    <Card className="my-2 rounded-md shadow-none">
      <CardHeader>
        <CardTitle>Nombre d'effectif par niveau</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="name"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              tickFormatter={(value) => value?.slice(0, 3)}
              hide
            />
            <XAxis dataKey="effectif" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="effectif"
              layout="vertical"
              fill="var(--color-effectif)"
              radius={4}
            >
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-[--color-label]"
                fontSize={12}
              />
              <LabelList
                dataKey="effectif"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
