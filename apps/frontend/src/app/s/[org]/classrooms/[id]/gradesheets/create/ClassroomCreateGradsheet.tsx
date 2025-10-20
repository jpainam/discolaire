"use client";

import { useQueryStates } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import { CreateGradeSheet } from "~/components/classrooms/gradesheets/grades/CreateGradeSheet";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { ClassroomCreateGradeSheetHeader } from "./ClassroomCreateGradeSheetHeader";
import { PreviousCreatedGradeSheet } from "./PreviousCreatedGradeSheet";
import { createGradeSheetSearchSchema } from "./search-params";

export function ClassroomCreateGradesheet({
  students,
}: {
  students: RouterOutputs["classroom"]["students"];
}) {
  const [searchParams] = useQueryStates(createGradeSheetSearchSchema);

  const canCreateGradeSheet = useCheckPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );

  return (
    <div className="flex flex-col">
      <ClassroomCreateGradeSheetHeader />

      {canCreateGradeSheet && searchParams.termId && searchParams.subjectId && (
        <div className="grid grid-cols-4 gap-2 divide-x">
          <CreateGradeSheet
            className="col-span-3"
            subjectId={searchParams.subjectId}
            termId={searchParams.termId}
            students={students}
          />
          <PreviousCreatedGradeSheet />
        </div>
      )}
    </div>
  );
}
