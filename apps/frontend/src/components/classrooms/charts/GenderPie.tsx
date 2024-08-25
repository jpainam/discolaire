"use client";

import { useLocale } from "@/hooks/use-locale";
import { Classroom } from "@/types/classroom";
import { Card, CardContent } from "@repo/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";
import { LabelList, Pie, PieChart } from "recharts";

export function GenderPie({ classroom }: { classroom: Classroom }) {
  const { t } = useLocale();
  const chartData = [
    {
      gender: "male",
      count: classroom?.maleCount || 10,
      fill: "var(--color-male)",
    },
    {
      gender: "female",
      count: classroom?.maleCount || 20,
      fill: "var(--color-female)",
    },
  ];
  const chartConfig = {
    count: {
      label: t("effectif"),
    },
    male: {
      label: t("M"),
      color: "hsl(var(--chart-1))",
    },
    female: {
      label: t("F"),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;
  return (
    <Card className="flex flex-col border-none shadow-none">
      {/* <CardHeader className="items-center pb-0">
        <CardDescription>{t("effectif")}</CardDescription>
      </CardHeader> */}
      <CardContent className="flex-1 p-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[120px]"
        >
          <PieChart>
            <ChartTooltip
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Pie data={chartData} dataKey="count">
              <LabelList
                dataKey="gender"
                className="fill-background"
                stroke="none"
                fontSize={12}
                formatter={(value: keyof typeof chartConfig) =>
                  chartConfig[value]?.label
                }
              />
            </Pie>
            {/* <ChartLegend
              content={<ChartLegendContent nameKey="gender" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            /> */}
          </PieChart>
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
