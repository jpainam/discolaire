/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { Grade } from "@prisma/client";
import _ from "lodash";

export function getRank(array: number[], target: number): number {
  const sortedArray = [...array].sort((a, b) => b - a);
  const index = sortedArray.indexOf(target);
  if (index === -1) {
    return -1;
  }
  const rank = index + 1;
  return rank;
}

export function calculateFinalGrade(
  grades: Grade[],
  weights: number[],
): number {
  const presentGrades = grades.filter(
    (grade) => !grade.isAbsent && grade.grade !== null,
  );
  const presentWeights = weights.filter(
    (_, i) => !grades[i]?.isAbsent && grades[i]?.grade !== null,
  );

  const weightSum = _.sum(presentWeights);
  const normalizedWeights = presentWeights.map((weight) => weight / weightSum);

  const finalGrade = presentGrades.reduce(
    (sum, grade, i) => sum + (grade.grade || 0) * (normalizedWeights[i] ?? 0),
    0,
  );

  return finalGrade;
}
