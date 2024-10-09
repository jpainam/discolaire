"use client";

import { Bar, BarChart, LabelList, XAxis, YAxis } from "recharts";

import { useLocale } from "@repo/i18n";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/card";
import { ChartContainer } from "@repo/ui/chart";
import { Separator } from "@repo/ui/separator";

import { cn } from "~/lib/utils";

export function MaleVsFemaleCount({
  maleCount,
  femaleCount,
  totalCount,
  title,
  className,
}: {
  maleCount: number;
  femaleCount: number;
  totalCount: number;
  title: string;
  className?: string;
}) {
  const { t } = useLocale();
  return (
    <Card className={cn("rounded-sm shadow-none", className)}>
      <CardHeader className="p-2">
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2 p-2">
        <ChartContainer
          config={{
            boys: {
              label: t("boys"),
              color: "hsl(var(--chart-1))",
            },
            girls: {
              label: t("girls"),
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[140px] w-full"
        >
          <BarChart
            margin={{
              left: 0,
              right: 0,
              top: 0,
              bottom: 10,
            }}
            data={[
              {
                activity: t("girls"),
                value: femaleCount,
                label: `${((femaleCount / totalCount) * 100).toFixed(2)} %`,
                fill: "var(--color-girls)",
              },

              {
                activity: t("boys"),
                value: maleCount,
                label: `${((maleCount / totalCount) * 100).toFixed(2)} %`,
                fill: "var(--color-boys)",
              },
            ]}
            layout="vertical"
            barSize={32}
            barGap={2}
          >
            <XAxis type="number" dataKey="value" hide />
            <YAxis
              dataKey="activity"
              type="category"
              tickLine={false}
              tickMargin={4}
              axisLine={false}
              className="capitalize"
            />
            <Bar dataKey="value" radius={5}>
              <LabelList
                position="insideLeft"
                dataKey="label"
                fill="white"
                offset={8}
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex flex-row border-t p-4">
        <div className="flex w-full items-center gap-2">
          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-md text-muted-foreground">{t("boys")}</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {maleCount}
            </div>
          </div>
          <Separator orientation="vertical" className="mx-2 h-10 w-px" />

          <div className="grid flex-1 auto-rows-min gap-0.5">
            <div className="text-md text-muted-foreground">{t("girls")}</div>
            <div className="flex items-baseline gap-1 text-xl font-bold tabular-nums leading-none">
              {femaleCount}
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
