"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts";

import type { ChartConfig } from "@repo/ui/components/chart";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { ChartContainer, ChartTooltip } from "@repo/ui/components/chart";
import { Empty, EmptyTitle } from "@repo/ui/components/empty";
import { Skeleton } from "@repo/ui/components/skeleton";

import { Badge } from "~/components/base-badge";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useTRPC } from "~/trpc/react";

const chartConfig = {
  classroomAvg: {
    label: "MoyCl",
    color: "var(--color-pink-500)",
  },
  grade: {
    label: "grade",
    color: "var(--color-teal-500)",
  },
} satisfies ChartConfig;

// Custom Tooltip
interface TooltipProps {
  active?: boolean;
  payload?: {
    dataKey: string;
    value: number;
    color: string;
  }[];
  label?: string;
}

const ChartLabel = ({
  label,
  color = chartConfig.grade.color,
}: {
  label: string;
  color: string;
}) => {
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="bg-background size-3.5 rounded-full border-4"
        style={{ borderColor: color }}
      ></div>
      <span className="text-muted-foreground">{label}</span>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  const t = useTranslations();
  if (active && payload?.length) {
    // Filter out gradeArea from tooltip
    const filteredPayload = payload.filter(
      (entry) => entry.dataKey !== "gradeArea",
    );

    return (
      <div className="bg-popover min-w-[180px] rounded-lg border p-3 shadow-sm shadow-black/5">
        <div className="text-muted-foreground mb-2.5 text-xs font-medium tracking-wide">
          {label}
        </div>
        <div className="space-y-2">
          {filteredPayload.map((entry, index) => {
            const config =
              chartConfig[entry.dataKey as keyof typeof chartConfig];
            const firstPayload = filteredPayload[0];
            if (!firstPayload) return <></>;
            return (
              <div key={index} className="flex items-center gap-2 text-xs">
                <ChartLabel label={t(config.label) + ":"} color={entry.color} />
                <span className="text-popover-foreground font-semibold">
                  {entry.value.toFixed(1)}
                </span>
                {config.label == "MoyCl" && (
                  <Badge
                    variant={
                      ((entry.value - firstPayload.value) /
                        firstPayload.value) *
                        100 <
                      0
                        ? "success"
                        : "destructive"
                    }
                    appearance="light"
                    className="flex items-center gap-1 text-xs"
                  >
                    {((entry.value - firstPayload.value) / firstPayload.value) *
                      100 <
                    0 ? (
                      <ArrowUp className="size-3" />
                    ) : (
                      <ArrowDown className="size-3" />
                    )}
                    {firstPayload.value == 0
                      ? 100
                      : Math.abs(
                          ((entry.value - firstPayload.value) /
                            firstPayload.value) *
                            100,
                        ).toFixed(0)}
                    %
                  </Badge>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export function StudentGradesheetChart({
  classroomId,
  defaultTerm,
}: {
  classroomId: string;
  defaultTerm: string;
}) {
  const [selectedTerm, setSelectedTerm] = useState<string | null>();
  const params = useParams<{ id: string }>();
  const t = useTranslations();
  const trpc = useTRPC();
  const gradesheetQuery = useQuery(
    trpc.classroom.getMinMaxMoyGrades.queryOptions(classroomId),
  );
  const gradeQuery = useQuery(
    trpc.student.grades.queryOptions({ id: params.id }),
  );
  const chartData = useMemo(() => {
    const grades = gradeQuery.data;
    const gradesheet = gradesheetQuery.data;
    const term = selectedTerm ?? defaultTerm;
    return gradesheet
      ?.filter((g) => g.termId == term)
      .map((g) => {
        const grade = grades?.find((gg) => gg.gradeSheetId == g.gradeSheetId);
        return {
          subject: grade?.gradeSheet.subject.course.shortName ?? "",
          classroomAvg: g.avg ?? 0,
          grade: grade?.grade ?? 0,
          gradeArea: grade?.grade ?? 0,
        };
      });
  }, [defaultTerm, gradeQuery.data, gradesheetQuery.data, selectedTerm]);

  if (gradeQuery.isPending || gradesheetQuery.isPending) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-20" />
        ))}
      </div>
    );
  }
  const refLine =
    chartData && chartData.length > 0
      ? chartData.reduce((max, item) => (item.grade > max.grade ? item : max))
      : undefined;
  return (
    <Card className="bg-transparent">
      <CardHeader className="">
        <CardTitle>
          <TermSelector
            className="w-65"
            onChange={(val) => setSelectedTerm(val)}
          />
        </CardTitle>
        <CardAction>
          <div className="flex items-center gap-4 text-sm">
            <ChartLabel label={t("grade")} color={chartConfig.grade.color} />
            <ChartLabel label="MoyCl" color={chartConfig.classroomAvg.color} />
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col items-end px-2">
        {chartData?.length === 0 && (
          <Empty>
            <EmptyTitle>Aucune notes</EmptyTitle>
          </Empty>
        )}
        <ChartContainer
          config={chartConfig}
          className="[&_.recharts-curve.recharts-tooltip-cursor]:stroke-initial h-[350px] w-full"
        >
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: 15,
              left: 5,
              bottom: 5,
            }}
          >
            <defs>
              <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartConfig.grade.color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="100%"
                  stopColor={chartConfig.grade.color}
                  stopOpacity={0.05}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="4 4"
              stroke="var(--input)"
              strokeOpacity={1}
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="subject"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, className: "text-muted-foreground" }}
              dy={5}
              tickMargin={12}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, className: "text-muted-foreground" }}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
              tickFormatter={(value) => `${value.toFixed(1)}`}
              //domain={["dataMin - 20", "dataMax + 20"]}
              tickMargin={12}
            />

            {/* Current subject reference line */}
            <ReferenceLine
              x={refLine?.subject ?? ""}
              stroke={chartConfig.grade.color}
              strokeWidth={1}
            />

            {/* Tooltip */}
            <ChartTooltip
              content={<CustomTooltip />}
              cursor={{
                stroke: "var(--input)",
                strokeWidth: 1,
                strokeDasharray: "none",
              }}
            />

            {/* grade area with gradient background */}
            <Area
              type="linear"
              dataKey="gradeArea"
              stroke="transparent"
              fill="url(#gradeGradient)"
              strokeWidth={0}
              dot={false}
            />

            {/* grade line with dots */}
            <Line
              type="linear"
              dataKey="grade"
              stroke={chartConfig.grade.color}
              strokeWidth={2}
              dot={{
                fill: "var(--background)",
                strokeWidth: 2,
                r: 6,
                stroke: chartConfig.grade.color,
              }}
            />

            {/* classroomAvg line (dashed) */}
            <Line
              type="linear"
              dataKey="classroomAvg"
              stroke={chartConfig.classroomAvg.color}
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={{
                fill: "var(--background)",
                strokeWidth: 2,
                r: 6,
                stroke: chartConfig.classroomAvg.color,
                strokeDasharray: "0",
              }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
