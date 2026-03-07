"use client";

import { useId } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import type { ChartConfig } from "~/components/ui/chart";
import { CustomTooltipContent } from "~/components/charts-extra";
import { Badge } from "~/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ChartContainer, ChartTooltip } from "~/components/ui/chart";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/lib/utils";
import { useTRPC } from "~/trpc/react";

export function MonthlyActivities({ className }: { className?: string }) {
  const id = useId();
  const t = useTranslations();
  const trpc = useTRPC();

  const { data: chartData = [], isLoading } = useQuery(
    trpc.library.monthlyActivities.queryOptions(),
  );

  const chartConfig = {
    loans: {
      label: t("borrowed"),
      color: "var(--chart-4)",
    },
    returned: {
      label: t("returned"),
      color: "var(--chart-1)",
    },
    overdue: {
      label: t("overdue"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const firstMonth = chartData[0]?.month ?? "";
  const lastMonth = chartData[chartData.length - 1]?.month ?? "";
  const total = chartData.reduce((acc, d) => acc + d.loans, 0);

  return (
    <Card className={cn(className)}>
      <CardHeader>
        <CardTitle>{t("monthly_activities")}</CardTitle>
        <CardDescription className="flex items-start gap-2">
          {isLoading ? (
            <Skeleton className="h-5 w-24" />
          ) : (
            <Badge className="border-none bg-emerald-500/24 text-emerald-500">
              {total.toLocaleString()} emprunts
            </Badge>
          )}
        </CardDescription>
        <CardAction className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="bg-chart-4 size-1.5 shrink-0 rounded-xs"
            />
            <div className="text-muted-foreground/50 text-[13px]/3">
              {t("borrowed")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="bg-chart-1 size-1.5 shrink-0 rounded-xs"
            />
            <div className="text-muted-foreground/50 text-[13px]/3">
              {t("returned")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="bg-chart-3 size-1.5 shrink-0 rounded-xs"
            />
            <div className="text-muted-foreground/50 text-[13px]/3">
              {t("overdue")}
            </div>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-60 w-full" />
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-60 w-full [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-[var(--chart-1)]/15"
          >
            <BarChart
              accessibilityLayer
              data={chartData}
              maxBarSize={20}
              margin={{ left: -12, right: 12, top: 12 }}
            >
              <defs>
                <linearGradient
                  id={`${id}-gradient`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor="var(--chart-1)" />
                  <stop offset="100%" stopColor="var(--chart-2)" />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="2 2"
                stroke="var(--border)"
              />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={12}
                ticks={[firstMonth, lastMonth]}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: number) =>
                  value === 0 ? "0" : `${value.toFixed(0)}`
                }
              />
              <ChartTooltip
                content={
                  <CustomTooltipContent
                    colorMap={{
                      loans: "var(--chart-4)",
                      returned: "var(--chart-1)",
                      overdue: "var(--chart-3)",
                    }}
                    labelMap={{
                      loans: t("borrowed"),
                      returned: t("returned"),
                      overdue: t("overdue"),
                    }}
                    dataKeys={["loans", "returned", "overdue"]}
                    valueFormatter={(value) => `${value.toLocaleString()}`}
                  />
                }
              />
              <Bar dataKey="loans" fill="var(--chart-4)" stackId="a" />
              <Bar
                dataKey="returned"
                fill={`url(#${id}-gradient)`}
                stackId="a"
              />
              <Bar dataKey="overdue" fill="var(--chart-3)" stackId="a" />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
