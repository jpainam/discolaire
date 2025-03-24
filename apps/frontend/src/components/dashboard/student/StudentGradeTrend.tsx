"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import type { ChartConfig } from "@repo/ui/components/chart";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useIsMobile } from "~/hooks/use-mobile";
import { useLocale } from "~/i18n";

export const description = "An interactive area chart";

const chartData = [
  { date: "2024-04-01", grade: 222, maxGrade: 150 },
  { date: "2024-04-02", grade: 97, maxGrade: 180 },
  { date: "2024-04-03", grade: 167, maxGrade: 120 },
  { date: "2024-04-04", grade: 242, maxGrade: 260 },
  { date: "2024-04-05", grade: 373, maxGrade: 290 },
  { date: "2024-04-06", grade: 301, maxGrade: 340 },
];

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  grade: {
    label: "Grade",
    color: "var(--chart-2)",
  },
  maxGrade: {
    label: "MaxGrade",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

export function StudentGradeTrend({
  data,
  subjects,
}: {
  subjects: { id: number; name: string }[];
  data: {
    subjectId: number;
    grade: number;
    maxGrade: number;
  }[];
}) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");
  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });
  const { t } = useLocale();

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Visitors</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last 3 months
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <Select
            defaultValue="all"
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger
              className="w-56 "
              size="sm"
              //aria-label="Select a value"
            >
              <SelectValue placeholder={t("subjects")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              {subjects.map((subject) => {
                return (
                  <SelectItem
                    key={subject.id}
                    value={`${subject.id}`}
                    //className="rounded-lg"
                  >
                    {subject.name}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillGrade" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-grade)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-grade)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-maxGrade)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-maxGrade)"
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
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="maxGrade"
              type="natural"
              fill="url(#fillMobile)"
              stroke="var(--color-maxGrade)"
              stackId="a"
            />
            <Area
              dataKey="grade"
              type="natural"
              fill="url(#fillGrade)"
              stroke="var(--color-grade)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
