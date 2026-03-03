"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkSquare02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import type { RouterOutputs } from "@repo/api";

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
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";

export function ClassroomGradeChart({
  grades,
  scale,
  className,
}: {
  grades: RouterOutputs["gradeSheet"]["grades"];
  scale: number;
  className?: string;
}) {
  const t = useTranslations();
  const pathname = usePathname();

  // Thresholds proportional to scale (calibrated for scale=20)
  const tPass = scale / 2; // 10 @ 20, 5 @ 10
  const tGood = scale * 0.7; // 14 @ 20, 7 @ 10
  const tExcellent = scale * 0.9; // 18 @ 20, 9 @ 10
  const tPassable = scale * 0.4; // 8  @ 20, 4 @ 10
  const tLow = scale * 0.25; // 5  @ 20, 2.5 @ 10

  const p05 = grades.filter((g) => !g.isAbsent && g.grade < tLow).length;
  const p09 = grades.filter((g) => g.grade >= tLow && g.grade < tPass).length;
  const p13 = grades.filter((g) => g.grade >= tPass && g.grade < tGood).length;
  const p17 = grades.filter(
    (g) => g.grade >= tGood && g.grade < tExcellent,
  ).length;
  const p20 = grades.filter((g) => g.grade >= tExcellent).length;
  const total = grades.filter((g) => !g.isAbsent).length;

  const malePassedCount = grades.filter(
    (g) => g.grade >= tPass && g.student.gender === "male",
  ).length;
  const femalePassedCount = grades.filter(
    (g) => g.grade >= tPass && g.student.gender === "female",
  ).length;
  const maleFailedCount = grades.filter(
    (g) => !g.isAbsent && g.grade < tPass && g.student.gender === "male",
  ).length;
  const femaleFailedCount = grades.filter(
    (g) => !g.isAbsent && g.grade < tPass && g.student.gender === "female",
  ).length;

  const countp18 = grades.filter((g) => g.grade >= tExcellent).length;
  const countp14 = grades.filter(
    (g) => g.grade >= tGood && g.grade < tExcellent,
  ).length;
  const countp10 = grades.filter(
    (g) => g.grade >= tPass && g.grade < tGood,
  ).length;
  const countp05 = grades.filter(
    (g) => g.grade >= tPassable && g.grade < tPass,
  ).length;
  const countp00 = grades.filter(
    (g) => !g.isAbsent && g.grade < tPassable,
  ).length;
  return (
    <div className={cn("flex flex-col gap-2 overflow-hidden p-2", className)}>
      <Card className="group/dist">
        <CardHeader>
          <CardTitle>{t("Grade distribution")}</CardTitle>
          <CardAction className="pointer-events-none opacity-0 transition-opacity group-focus-within/dist:pointer-events-auto group-focus-within/dist:opacity-100 group-hover/dist:pointer-events-auto group-hover/dist:opacity-100">
            <Link target="_blank" href={pathname} aria-label={t("details")}>
              <HugeiconsIcon className="size-4" icon={LinkSquare02Icon} />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              count: {
                label: "Nb d'élèves",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-full w-full"
          >
            <BarChart
              data={[
                { range: `0-${tLow}`, count: p05, fill: "#ef4444" },
                { range: `${tLow}-${tPass}`, count: p09, fill: "#f97316" },
                { range: `${tPass}-${tGood}`, count: p13, fill: "#eab308" },
                {
                  range: `${tGood}-${tExcellent}`,
                  count: p17,
                  fill: "#22c55e",
                },
                {
                  range: `${tExcellent}-${scale}`,
                  count: p20,
                  fill: "#16a34a",
                },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis width={25} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="group/dist">
        <CardHeader>
          <CardTitle>{t("Success by gender")}</CardTitle>
          <CardAction className="pointer-events-none opacity-0 transition-opacity group-focus-within/dist:pointer-events-auto group-focus-within/dist:opacity-100 group-hover/dist:pointer-events-auto group-hover/dist:opacity-100">
            <Link target="_blank" href={pathname} aria-label={t("details")}>
              <HugeiconsIcon className="size-4" icon={LinkSquare02Icon} />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent className="">
          <ChartContainer
            config={{
              males: {
                label: "Garçons",
                color: "#3b82f6",
              },
              females: {
                label: "Filles",
                color: "#ec4899",
              },
            }}
            className="h-full w-full"
          >
            <PieChart>
              <Pie
                data={[
                  {
                    name: "Garçons réussis",
                    value: malePassedCount,
                    fill: "#3b82f6",
                  },
                  {
                    name: "Garçons échoués",
                    value: maleFailedCount,
                    fill: "#9315fd",
                  },
                  {
                    name: "Filles réussies",
                    value: femalePassedCount,
                    fill: "#16a34a",
                  },
                  {
                    name: "Filles échouées",
                    value: femaleFailedCount,
                    fill: "#ec4899",
                  },
                ]}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card className="group/dist">
        <CardHeader>
          <CardTitle>{t("Grade distribution")}</CardTitle>
          <CardAction className="pointer-events-none opacity-0 transition-opacity group-focus-within/dist:pointer-events-auto group-focus-within/dist:opacity-100 group-hover/dist:pointer-events-auto group-hover/dist:opacity-100">
            <Link target="_blank" href={pathname} aria-label={t("details")}>
              <HugeiconsIcon className="size-4" icon={LinkSquare02Icon} />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <Label>Excellent {`>= ${tExcellent}`}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${(countp18 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp18}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <Label>Bien {`>= ${tGood}`}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(countp14 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp14}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <Label>Assez bien {`>= ${tPass}`}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{ width: `${(countp10 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp10}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <Label>Passable {`>= ${tPassable}`}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: `${(countp05 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp05}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <Label>Nul {`< ${tPassable}`}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: `${(countp00 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp00}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
