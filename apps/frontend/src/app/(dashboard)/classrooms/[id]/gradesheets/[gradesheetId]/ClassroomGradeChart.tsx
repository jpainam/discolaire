"use client";
import type { RouterOutputs } from "@repo/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@repo/ui/components/chart";
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
import { useLocale } from "~/i18n";
export function ClassroomGradeChart({
  grades,
}: {
  grades: RouterOutputs["gradeSheet"]["grades"];
}) {
  const { t } = useLocale();
  const p05 = grades.filter((g) => !g.isAbsent && g.grade < 5).length;
  const p09 = grades.filter((g) => g.grade >= 5 && g.grade < 10).length;
  const p13 = grades.filter((g) => g.grade >= 10 && g.grade < 14).length;
  const p17 = grades.filter((g) => g.grade >= 14 && g.grade < 18).length;
  const p20 = grades.filter((g) => g.grade >= 18).length;
  const total = grades.filter((g) => !g.isAbsent).length;
  //const totalFailed = grades.filter((g) => g.grade < 10).length;

  const malePassedCount = grades.filter(
    (g) => g.grade >= 10 && g.student.gender === "male",
  ).length;
  const femalePassedCount = grades.filter(
    (g) => g.grade >= 10 && g.student.gender === "female",
  ).length;
  const maleFailedCount = grades.filter(
    (g) => !g.isAbsent && g.grade < 10 && g.student.gender === "male",
  ).length;
  const femaleFailedCount = grades.filter(
    (g) => !g.isAbsent && g.grade < 10 && g.student.gender === "female",
  ).length;

  const countp18 = grades.filter((g) => g.grade >= 18).length;
  const countp14 = grades.filter((g) => g.grade >= 14 && g.grade < 18).length;
  const countp10 = grades.filter((g) => g.grade >= 10 && g.grade < 14).length;
  const countp05 = grades.filter((g) => g.grade >= 8 && g.grade < 10).length;
  const countp00 = grades.filter((g) => !g.isAbsent && g.grade < 8).length;
  return (
    <div className="flex flex-col gap-2">
      <Card className="px-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Distribution des notes
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ChartContainer
            config={{
              count: {
                label: "Nb d'élèves",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[200px]"
          >
            <BarChart
              data={[
                { range: "0-5", count: p05, fill: "#ef4444" },
                { range: "6-9", count: p09, fill: "#f97316" },
                { range: "10-13", count: p13, fill: "#eab308" },
                { range: "14-17", count: p17, fill: "#22c55e" },
                { range: "18-20", count: p20, fill: "#16a34a" },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t("Success by gender")}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
            className="h-[200px]"
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
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            {t("Grade distribution")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm">Excellent {">= 18"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${(countp18 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp18}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm">Bien {">= 14"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(countp14 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp14}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-sm">Assez bien {">= 10"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${(countp10 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp10}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm">Passable {">= 8"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-yellow-500 h-2 rounded-full"
                    style={{ width: `${(countp05 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{countp05}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm">Nul {"< 8"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-red-500 h-2 rounded-full"
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
