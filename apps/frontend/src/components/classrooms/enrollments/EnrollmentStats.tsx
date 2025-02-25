/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import type { Student } from "@repo/db";
import { useLocale } from "~/i18n";

export function EnrollmentStats({ students }: { students: Student[] }) {
  const { t } = useLocale();
  const total = students.length;
  const females = students.filter((s) => s.gender == "female").length;
  const males = total - females;
  const repeating = students.filter((s) => s.isRepeating).length;
  return (
    <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-4">
      <span>
        Effectif
        {total} and {females}
        this is for test {}
        Mettre total des eleves. utiliser le trend Up or Down icon pour montrer
        si cette classe a 4.4% de plus ou moins eleves que l'annee derniere.
        Mettre Up or Down pour montrer le nombre par rapport a la moyenn des
        effectif dans d'autre classe.
      </span>
      {/* <EnrollmentSummaryCard title={t("effectif")} /> */}
      <EnrollmentSummaryCard
        title="fille"
        stroke="#D7E3FE"
        size={80}
        percentage={Math.floor((females / total) * 100)}
        progressColor="#EE0000"
      />
      <EnrollmentSummaryCard
        title="fille"
        stroke="#D7E3FE"
        size={80}
        percentage={Math.floor((males / total) * 100)}
        progressColor="#3872FA"
      />
      <EnrollmentSummaryCard
        title={t("repeating")}
        stroke="#D7E3FE"
        size={repeating}
        percentage={Math.floor((repeating / total) * 100)}
        progressColor="#3872FA"
      />
      <div>Repeating: {repeating}</div>
      <div>Average age</div>
      <div>oldest age</div>
      <div>youngest age</div>
    </div>
  );
}

interface EnrollmentSummaryCardProps {
  title?: string;
  percentage: number;
  stroke: string;
  progressColor: string;
  size: number;
}
function EnrollmentSummaryCard({
  title,
  percentage,
  stroke,
  size,
  progressColor,
}: EnrollmentSummaryCardProps) {
  return (
    <div className="flex h-20 w-auto flex-row justify-between gap-4 rounded-lg border p-2">
      <span>{title}</span>
      {/* <CircleProgressBar
        percentage={percentage}
        size={size}
        stroke={stroke}
        strokeWidth={7}
        progressColor={progressColor}
        useParentResponsive={true}
        label={
          <span className="font-lexend text-base font-medium text-gray-700">
            {percentage}%
          </span>
        }
        strokeClassName="dark:stroke-gray-300"
      /> */}
    </div>
  );
}
