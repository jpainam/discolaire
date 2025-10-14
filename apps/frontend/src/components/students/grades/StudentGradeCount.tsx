"use client";

import { useMemo } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  Notebook,
  NotepadText,
  ProportionsIcon,
  Rows3Icon,
} from "lucide-react";
import { useQueryState } from "nuqs";

import {
  MetricCard,
  MetricCardGroup,
  MetricCardHeader,
  MetricCardTitle,
  MetricCardValue,
} from "~/components/metric-card";
import { TermSelector } from "~/components/shared/selects/TermSelector";
import { useTRPC } from "~/trpc/react";

export function StudentGradeCount({ studentId }: { studentId: string }) {
  const trpc = useTRPC();
  const { data: allgrades } = useSuspenseQuery(
    trpc.student.grades.queryOptions({ id: studentId }),
  );
  const [termId, setTermId] = useQueryState("termId");

  const {
    maxGrade,
    minGrade,
    averageGrade,
    total,
    successRate,
    p18,
    p14,
    p10,
    p05,
    p00,
  } = useMemo(() => {
    let grades = allgrades;
    if (termId) {
      grades = allgrades.filter((g) => g.gradeSheet.termId === termId);
    }
    const countp18 = grades.filter((g) => g.grade >= 18).length;
    const countp14 = grades.filter((g) => g.grade >= 14 && g.grade < 18).length;
    const countp10 = grades.filter((g) => g.grade >= 10 && g.grade < 14).length;
    const countp05 = grades.filter((g) => g.grade >= 8 && g.grade < 10).length;
    const countp00 = grades.filter((g) => !g.isAbsent && g.grade < 8).length;
    const totalGrades = grades.length;
    const maxGrade =
      totalGrades > 0 ? Math.max(...grades.map((g) => g.grade)) : 0;
    const minGrade =
      totalGrades > 0 ? Math.min(...grades.map((g) => g.grade)) : 0;
    const averageGrade =
      totalGrades > 0
        ? grades.reduce((acc, g) => acc + g.grade, 0) / totalGrades
        : 0;
    const successCount = grades.filter((g) => g.grade >= 10).length;
    const successRate =
      successCount > 0 && totalGrades > 0
        ? (successCount / totalGrades) * 100
        : 0;
    return {
      maxGrade,
      minGrade,
      averageGrade,
      total: totalGrades,
      successRate,
      p18: countp18,
      p14: countp14,
      p10: countp10,
      p05: countp05,
      p00: countp00,
    };
  }, [allgrades, termId]);

  return (
    <div className="flex flex-col gap-4 py-2 pr-2">
      <div className="gap-4">
        <div>
          <div className="space-y-2">
            <TermSelector
              className="w-full"
              defaultValue={termId}
              onChange={(val) => {
                void setTermId(val);
              }}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-sm">Excellent {">= 18"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-green-500"
                    style={{ width: `${(p18 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{p18}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-sm">Bien {">= 14"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(p14 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{p14}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-sm">Assez bien {">= 10"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-orange-500"
                    style={{ width: `${(p10 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{p10}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <span className="text-sm">Passable {">= 8"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-yellow-500"
                    style={{ width: `${(p05 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{p05}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-sm">Nul {"< 8"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-20 rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-red-500"
                    style={{ width: `${(p00 / total) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{p00}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <MetricCardGroup className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
        <MetricCard variant={"success"}>
          <MetricCardHeader className="flex items-center justify-between gap-2">
            <MetricCardTitle className="truncate">Note maximum</MetricCardTitle>
            <NotepadText className="size-4" />
          </MetricCardHeader>
          <MetricCardValue>
            {isFinite(maxGrade) ? maxGrade.toFixed(2) : "N/A"}
          </MetricCardValue>
        </MetricCard>
        <MetricCard variant={"destructive"}>
          <MetricCardHeader className="flex items-center justify-between gap-2">
            <MetricCardTitle className="truncate">Note mininum</MetricCardTitle>
            <Notebook className="size-4" />
          </MetricCardHeader>
          <MetricCardValue>
            {isFinite(minGrade) ? minGrade.toFixed(2) : "N/A"}
          </MetricCardValue>
        </MetricCard>
        <MetricCard variant={"warning"}>
          <MetricCardHeader className="flex items-center justify-between gap-2">
            <MetricCardTitle className="truncate">Note moyenne</MetricCardTitle>
            <Rows3Icon className="size-4" />
          </MetricCardHeader>
          <MetricCardValue>
            {isFinite(averageGrade) ? averageGrade.toFixed(2) : "N/A"}
          </MetricCardValue>
        </MetricCard>
        <MetricCard variant={"default"}>
          <MetricCardHeader className="flex items-center justify-between gap-2">
            <MetricCardTitle className="truncate">
              Taux de réussite
            </MetricCardTitle>
            <ProportionsIcon className="size-4" />
          </MetricCardHeader>
          <MetricCardValue>{successRate.toFixed(2)}%</MetricCardValue>
        </MetricCard>
      </MetricCardGroup>
    </div>
  );
}
