"use client";

import { useParams } from "next/navigation";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useQueryState } from "nuqs";

import { ReportCardAppreciation } from "~/components/classrooms/reportcards/ReportCardAppreciation";
import { ReportCardClassroomCouncil } from "~/components/classrooms/reportcards/ReportCardClassroomCouncil";
import { ReportCardSkillAcquisition } from "~/components/classrooms/reportcards/ReportCardSkillAcquisition";
import { EmptyComponent } from "~/components/EmptyComponent";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { useTRPC } from "~/trpc/react";
import { CheckSubjectScale } from "../../../app/(dashboard)/classrooms/[id]/reportcards/CheckSubjectScaleTerm";
import { ReportCardTerm } from "./ReportCardTerm";

export function ReportCardTermContainer() {
  const [termId] = useQueryState("termId");
  const params = useParams<{ id: string }>();
  const [action] = useQueryState("action");
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
      {action == "skills" ? (
        <ReportCardSkillAcquisition classroomId={params.id} termId={termId} />
      ) : action == "subjects" ? (
        <ReportCardAppreciation classroomId={params.id} termId={termId} />
      ) : action == "class_council" ? (
        <ReportCardClassroomCouncil
          classroomId={params.id}
          termId={termId}
          students={students}
        />
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
