"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { sum } from "lodash";

import { useLocale } from "@repo/i18n";
import type { FlatBadgeVariant } from "@repo/ui/FlatBadge";
import FlatBadge from "@repo/ui/FlatBadge";
import { Separator } from "@repo/ui/separator";

import { api } from "~/trpc/react";

export function SubjectStats() {
  const params = useParams<{ id: string }>();
  const subjectsQuery = api.classroom.subjects.useQuery({ id: params.id });

  const [countTeacher, setCountTeacher] = useState<number>(0);
  const [countGroups, setCountGroups] = useState<Record<string, number>>({});
  const [totalCoefficient, setTotalCoefficient] = useState<number>(0);

  useEffect(() => {
    const v = subjectsQuery.data?.map((s) => s.teacherId) || [];
    setCountTeacher(v.length);
    const groups: Record<string, number> = {};
    const coeff = sum(subjectsQuery.data?.map((s) => s.coefficient));
    subjectsQuery.data?.forEach((s) => {
      if (s.subjectGroup) {
        const name = s.subjectGroup.name;
        if (name && groups[name]) {
          groups[name]++;
        } else {
          groups[name] = 1;
        }
      }
    });
    setCountGroups(groups);
    setTotalCoefficient(coeff);
  }, [subjectsQuery]);

  const { t } = useLocale();
  const badgeVariants = [
    "blue",
    "red",
    "yellow",
    "gray",
    "purple",
  ] as FlatBadgeVariant[];
  return (
    <div className="flex flex-row items-center gap-2">
      <FlatBadge variant={"indigo"}>
        {subjectsQuery.data?.length} {t("subjects")}
      </FlatBadge>
      <FlatBadge variant={"green"}>
        {countTeacher} {t("teachers")}
      </FlatBadge>
      {countGroups &&
        Object.keys(countGroups).map((key, index) => {
          return (
            <FlatBadge
              key={key}
              variant={badgeVariants[index % badgeVariants.length]}
            >
              {countGroups[key]} {key}
            </FlatBadge>
          );
        })}
      <Separator orientation="vertical" />
      <FlatBadge variant={"pink"}>
        {totalCoefficient} {t("coefficient")}
      </FlatBadge>
    </div>
  );
}

function CoefficientDistribution() {
  return <div></div>;
}
