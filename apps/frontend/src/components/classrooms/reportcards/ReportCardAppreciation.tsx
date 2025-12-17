"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { Label } from "~/components/ui/label";
import { useTRPC } from "~/trpc/react";
import { ClassroomStudentSelector } from "./ClassroomStudentSelector";

export function ReportCardAppreciation({
  classroomId,
  termId,
}: {
  classroomId: string;
  termId: string;
}) {
  const trpc = useTRPC();
  const appreciationQuery = useQuery(
    trpc.appreciation.categories.queryOptions(),
  );
  const [studentId, setStudentId] = useState<string | null>();

  const categories = appreciationQuery.data;
  const t = useTranslations();

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-6">
        <div className="flex w-full items-center gap-2">
          <Label>{t("students")}</Label>
          <ClassroomStudentSelector
            className="w-1/3"
            onSelectAction={(v) => setStudentId(v)}
            classroomId={classroomId}
          />
        </div>
      </div>
    </div>
  );
}
