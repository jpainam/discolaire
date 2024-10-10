/* eslint-disable @typescript-eslint/no-unsafe-return */
"use client";

import React, { useEffect, useMemo } from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { ChartConfig } from "@repo/ui/chart";
import { useLocale } from "@repo/i18n";
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

import { showErrorToast } from "~/lib/handle-error";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function DashboardClassroomSize({ className }: { className?: string }) {
  const { t } = useLocale();
  // useEffect(() => {
  //   void captureException(new Error("DashboardClassroomSize").stack ?? "");
  // }, []);
  const chartConfig = useMemo(() => {
    return {
      maxSize: {
        label: t("max_size"),
        color: "hsl(var(--chart-5))",
      },
      size: {
        label: t("effective"),
        color: "hsl(var(--chart-3))",
      },
      difference: {
        label: t("difference"),
        color: "hsl(var(--chart-4))",
      },
    } satisfies ChartConfig;
  }, [t]);

  const classroomsQuery = api.classroom.all.useQuery();

  const [filteredData, setFilteredData] = React.useState<
    { name: string; maxSize: number; size: number }[]
  >([]);

  useEffect(() => {
    const data = classroomsQuery.data?.map((classroom) => {
      return {
        name: classroom.name,
        maxSize: classroom.maxSize || 0,
        size: classroom.size,
        difference: (classroom.maxSize || 0) - classroom.size,
      };
    });
    setFilteredData(data ?? []);
  }, [classroomsQuery.data]);

  if (classroomsQuery.isPending) {
    return (
      <div className="col-span-full flex w-full flex-col">
        <div className="flex w-full flex-row gap-4 p-2">
          <Skeleton className="h-[200px] w-1/3" />
          <Skeleton className="h-[200px] w-2/3" />
        </div>
        <div className="flex w-full flex-row gap-4 p-2">
          <Skeleton className="h-[200px] w-1/3" />
          <Skeleton className="h-[200px] w-2/3" />
        </div>
      </div>
    );
  }
  if (classroomsQuery.isError) {
    showErrorToast(classroomsQuery.error);
    return;
  }

  return (
    <Card className={cn("rounded-sm shadow-none", className)}>
      <CardHeader className="p-0">
        <div className="flex flex-1 flex-col px-6 py-2">
          <CardTitle>{t("classroom_size_vs_max_size")}</CardTitle>
          <CardDescription></CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer className="h-[300px] w-full p-0" config={chartConfig}>
          <BarChart accessibilityLayer data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent className="w-[200px]" indicator="dashed" />
              }
            />
            <Bar dataKey="maxSize" fill="var(--color-maxSize)" radius={4} />
            <Bar dataKey="size" fill="var(--color-size)" radius={4} />
            <Bar
              dataKey="difference"
              fill="var(--color-difference)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
