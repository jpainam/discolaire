"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { ReportCardAppreciation } from "~/components/classrooms/reportcards/ReportCardAppreciation";
import { EmptyComponent } from "~/components/EmptyComponent";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { CheckSubjectScale } from "./CheckSubjectScaleTerm";
import { ReportCardTerm } from "./ReportCardTerm";

export function ReportCardTermContainer() {
  const [termId] = useQueryState("termId");
  const params = useParams<{ id: string }>();
  const [appreciationType] = useQueryState("appreciationType");
  const trpc = useTRPC();
  const { data: classroom } = useSuspenseQuery(
    trpc.classroom.get.queryOptions(params.id),
  );
  const { data: subjects } = useSuspenseQuery(
    trpc.classroom.subjects.queryOptions(params.id),
  );
  const { data: students } = useSuspenseQuery(
    trpc.classroom.students.queryOptions(params.id),
  );

  const canCreateGradesheet = useCheckPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );

  if (!termId) {
    return (
      <EmptyComponent
        title="Veuillez choisir une période"
        description="Choisissez une période ou un trimestre pour commencer"
      />
    );
  }
  return (
    <>
      {canCreateGradesheet && (
        <CheckSubjectScale
          termId={termId}
          classroomId={params.id}
          subjects={subjects}
        />
      )}
      {appreciationType ? (
        <ReportCardAppreciation />
      ) : (
        <ReportCardTerm
          termId={termId}
          subjects={subjects}
          students={students}
          classroom={classroom}
        />
      )}
    </>
  );
}
