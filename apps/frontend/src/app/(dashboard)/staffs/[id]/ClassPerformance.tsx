"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartConfig } from "~/components/ui/chart";
import { EmptyComponent } from "~/components/EmptyComponent";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useTRPC } from "~/trpc/react";

export const description = "A bar chart with a custom label";

const sum = (num: number[]) => {
  return num.reduce((a, b) => a + b, 0);
};

const chartConfig = {
  average: {
    label: "Moyenne",
    color: "var(--chart-2)",
  },

  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function ClassPerformance({ staffId }: { staffId: string }) {
  const trpc = useTRPC();
  const { data: terms } = useSuspenseQuery(trpc.term.all.queryOptions());
  const t = useTranslations();

  const { data: gradesheets } = useSuspenseQuery(
    trpc.staff.gradesheets.queryOptions(staffId),
  );
  const [termId, setTermId] = useQueryState("termId");
  const chartData = useMemo(() => {
    let ggs = gradesheets;
    if (termId) {
      ggs = gradesheets.filter((gs) => gs.termId == termId);
    }
    return ggs.slice(0, 8).map((gs) => {
      const grades = gs.grades.filter((g) => !g.isAbsent).map((g) => g.grade);
      // const max = Math.max(...grades);
      // const min = Math.min(...grades);
      const avg = grades.length != 0 ? sum(grades) / grades.length : 0;
      return {
        course: `${gs.subject.course.shortName}/${gs.subject.classroom.reportName}`,
        average: avg.toFixed(2),
      };
    });
  }, [gradesheets, termId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Class Performance</CardTitle>
        <CardAction>
          <Select
            onValueChange={(value) => {
              void setTermId(value);
            }}
          >
            <SelectTrigger size="sm" className="w-[100px]">
              <SelectValue placeholder={t("terms")} />
            </SelectTrigger>
            <SelectContent>
              {terms.map((t, index) => (
                <SelectItem key={index} value={t.id}>
                  {t.shortName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent>
        {chartData.length == 0 ? (
          <EmptyComponent
            title="Aucune note"
            description="Ce personnel n'a aucune note"
          />
        ) : (
          <ChartContainer config={chartConfig}>
            <BarChart
              accessibilityLayer
              data={chartData}
              layout="vertical"
              margin={{
                right: 16,
              }}
            >
              <CartesianGrid horizontal={false} />
              <YAxis
                dataKey="course"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => {
                  return String(value);
                }}
                hide
              />
              <XAxis dataKey="average" type="number" hide />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Bar
                dataKey="average"
                layout="vertical"
                fill="var(--color-average)"
                radius={4}
              >
                <LabelList
                  dataKey="course"
                  position="insideLeft"
                  offset={8}
                  className="fill-(--color-label)"
                  fontSize={12}
                />
                <LabelList
                  dataKey="average"
                  position="right"
                  offset={8}
                  className="fill-foreground"
                  fontSize={12}
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
      </CardFooter> */}
    </Card>
  );
}
