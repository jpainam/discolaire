"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import type { Student } from "@repo/db";
import type { ChartConfig } from "@repo/ui/components/chart";
import { Card, CardContent } from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";

import { getServerTranslations } from "~/i18n/server";

export async function RepeatingPie({ students }: { students: Student[] }) {
  const { t } = await getServerTranslations();
  const chartConfig = {
    repeating: {
      label: t("repeating"),
      color: "var(--chart-1)",
    },
    nonrepeating: {
      label: t("nonrepeating"),
      color: "var(--chart-3)",
    },
  } satisfies ChartConfig;
  const repeating = students.filter((student) => student.isRepeating).length;
  const chartData = [
    {
      repeating: repeating,
      nonrepeating: students.length - repeating,
    },
  ];

  return (
    <Card className="flex flex-col border-none shadow-none">
      {/* <CardHeader className="items-center pb-0">
        <CardDescription>{t("isRepeating")}</CardDescription>
      </CardHeader> */}
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px] w-full"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {repeating.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy ?? 0) + 4}
                          className="fill-muted-foreground"
                        >
                          {t("repeating")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="repeating"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-repeating)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="nonrepeating"
              fill="var(--color-nonrepeating)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
