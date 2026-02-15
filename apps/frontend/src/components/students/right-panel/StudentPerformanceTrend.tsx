"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import type { ChartConfig } from "~/components/ui/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { useTRPC } from "~/trpc/react";

const chartConfig = {
  average: {
    label: "Average",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function StudentPerformanceTrend({ studentId }: { studentId: string }) {
  const trpc = useTRPC();
  const trendQuery = useQuery(trpc.student.academicSnapshots.queryOptions(studentId));

  const chartData = useMemo(() => {
    if (!trendQuery.data) {
      return [];
    }

    return trendQuery.data.map((entry) => ({
      term:
        entry.termShortName.trim().length > 0
          ? entry.termShortName
          : entry.termName,
      average: Number(entry.average.toFixed(2)),
      rank: entry.rank,
    }));
  }, [trendQuery.data]);

  if (trendQuery.isPending) {
    return <Skeleton className="h-52 w-full" />;
  }

  if (chartData.length === 0) {
    return (
      <p className="text-muted-foreground px-2 py-4 text-sm">
        No grade trend data available.
      </p>
    );
  }

  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{
          left: 12,
          right: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="term"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          interval="preserveStartEnd"
        />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
        <Line
          dataKey="average"
          type="linear"
          stroke="var(--color-average)"
          strokeWidth={2}
          dot={{ fill: "var(--color-average)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ChartContainer>
  );
}
