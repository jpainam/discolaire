"use client";

import { useMemo } from "react";
import _ from "lodash";
import { useTranslations } from "next-intl";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { RouterOutputs } from "@repo/api";

import type { ChartConfig } from "~/components/ui/chart";
import { Card, CardContent } from "~/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";

export function TransactionClassrooms({
  quotas,
}: {
  quotas: RouterOutputs["transaction"]["quotas"];
}) {
  const t = useTranslations();
  const chartConfig = useMemo(() => {
    return {
      revenue: {
        label: t("expected_amount"),
        color: "var(--chart-2)",
      },
      paid: {
        label: t("received_amount"),
        color: "var(--chart-1)",
      },
      remaining: {
        label: t("difference"),
        color: "var(--chart-4)",
      },
    } satisfies ChartConfig;
  }, [t]);

  const filteredData = useMemo(() => {
    return _.chunk(quotas, Math.ceil(quotas.length / 4));
  }, [quotas]);

  return (
    <div className="grid items-end gap-8 md:grid-cols-1">
      {filteredData.map((data, index) => {
        return (
          <Card key={index} className="rounded-sm shadow-none">
            <CardContent className="p-0">
              <ChartContainer
                className="h-[200px] w-full p-0"
                config={chartConfig}
              >
                <BarChart accessibilityLayer data={data}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="classroom"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        className="w-[200px]"
                        indicator="dashed"
                      />
                    }
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar
                    dataKey="revenue"
                    fill="var(--color-revenue)"
                    radius={4}
                  />
                  <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
                  <Bar
                    dataKey="remaining"
                    fill="var(--color-remaining)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
            {/* <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this month{" "}
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing total visitors for the last 6 months
              </div>
            </CardFooter> */}
          </Card>
        );
      })}
    </div>
  );
}
