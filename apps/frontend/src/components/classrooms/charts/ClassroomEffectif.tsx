"use client";

import { useEffect, useState } from "react";
import { inferProcedureOutput } from "@trpc/server";
import { sortBy } from "lodash";
import { Loader, TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import { useLocale } from "@repo/i18n";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@repo/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/chart";

import { AppRouter } from "~/server/api/root";

type ClassroomAllProcedureOutput = NonNullable<
  inferProcedureOutput<AppRouter["classroom"]["all"]>
>[number];

export function ClassroomEffectif({
  stats,
}: {
  stats: ClassroomAllProcedureOutput[];
}) {
  const [maleRate, setMaleRate] = useState<number>(0);
  const [femaleRate, setFemaleRate] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { t } = useLocale();
  const chartConfig = {
    male: {
      label: t("male"),
      color: "hsl(var(--chart-1))",
    },
    female: {
      label: t("female"),
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const [chartData, setChartData] = useState<
    { level: string; female: number; male: number }[]
  >([]);

  useEffect(() => {
    setLoading(true);
    const levels: Record<
      string,
      { level: string; levelId: number; female: number; male: number }
    > = {};

    stats?.forEach((stat) => {
      if (stat?.level) {
        levels[stat.level.name] = {
          level: stat.level.name,
          levelId: stat.levelId || 0,
          female:
            (levels[stat.level.name]?.female || 0) + stat.femaleCount || 0,
          male: (levels[stat.level.name]?.male || 0) + stat.maleCount || 0,
        };
      }
    });
    const values = Object.values(levels);
    setChartData(sortBy(values, "levelId"));
    const totalMale = values.reduce((acc, val) => acc + val.male, 0);
    const totalFemale = values.reduce((acc, val) => acc + val.female, 0);
    const total = totalMale + totalFemale || 1e-6;
    setMaleRate((totalMale / total) * 100);
    setFemaleRate((totalFemale / total) * 100);
    setLoading(false);
  }, [stats]);

  return (
    <Card className="m-1 w-[355px] border-none shadow-none">
      <CardHeader>
        {/* <CardTitle>Bar Chart - Multiple</CardTitle> */}
        <CardDescription>{t("classroom_effectif_per_level")}</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="level"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="female" fill="var(--color-female)" radius={4} />
            <Bar dataKey="male" fill="var(--color-male)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-center gap-2 text-sm">
        {loading && <Loader className="h-6 w-6" />}
        {!loading && (
          <div className="flex gap-2 font-medium leading-none">
            {maleRate.toFixed(2)} % {t("boys")}
            {maleRate > femaleRate ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
            vs. {femaleRate.toFixed(2)} % {t("girls")}
            {maleRate < femaleRate ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </div>
        )}
        {/* <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div> */}
      </CardFooter>
    </Card>
  );
}
