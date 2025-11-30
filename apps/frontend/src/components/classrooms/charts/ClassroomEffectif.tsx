import { sortBy } from "lodash";
import { TrendingDown, TrendingUp } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import type { RouterOutputs } from "@repo/api";
import type { ChartConfig } from "@repo/ui/components/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";

type ClassroomAllProcedureOutput = NonNullable<
  RouterOutputs["classroom"]["all"]
>[number];

export async function ClassroomEffectif({
  stats,
}: {
  stats: ClassroomAllProcedureOutput[];
}) {
  const t = await getTranslations();
  const chartConfig = {
    male: {
      label: t("male"),
      color: "var(--chart-1)",
    },
    female: {
      label: t("female"),
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig;

  const levels: Record<
    string,
    { level: string; levelId: string; female: number; male: number }
  > = {};

  stats.forEach((stat) => {
    levels[stat.level.name] = {
      level: stat.level.name,
      levelId: stat.levelId,
      female: (levels[stat.level.name]?.female ?? 0) + stat.femaleCount || 0,
      male: (levels[stat.level.name]?.male ?? 0) + stat.maleCount || 0,
    };
  });
  const values = Object.values(levels);
  const chartData: { level: string; female: number; male: number }[] = sortBy(
    values,
    "levelId",
  );
  const totalMale = values.reduce((acc, val) => acc + val.male, 0);
  const totalFemale = values.reduce((acc, val) => acc + val.female, 0);
  const total = totalMale + totalFemale || 1e-6;
  const maleRate = (totalMale / total) * 100;
  const femaleRate = (totalFemale / total) * 100;

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
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
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
        <div className="flex gap-2 leading-none font-medium">
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
      </CardFooter>
    </Card>
  );
}
