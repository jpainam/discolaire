"use client";

import { useQueryStates } from "nuqs";

import type { RouterOutputs } from "@repo/api";

import { CreateGradeSheet } from "~/components/classrooms/gradesheets/grades/CreateGradeSheet";
import { useCheckPermission } from "~/hooks/use-permission";
import { PermissionAction } from "~/permissions";
import { CurrentGradeSheetSummary } from "../../../../../../components/classrooms/gradesheets/CurrentGradeSheetSummary";
import { createGradeSheetSearchSchema } from "./search-params";

export function ClassroomCreateGradesheet({
  students,
  terms,
}: {
  students: RouterOutputs["classroom"]["students"];
  terms: RouterOutputs["term"]["all"];
}) {
  const [searchParams] = useQueryStates(createGradeSheetSearchSchema);

  const canCreateGradeSheet = useCheckPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );
  const selectedTerm = terms.find((t) => t.id == searchParams.termId);

  return (
    <>
      {canCreateGradeSheet &&
        selectedTerm &&
        searchParams.termId &&
        searchParams.subjectId && (
          <div className="grid grid-cols-4 gap-2 divide-x">
            <CreateGradeSheet
              className="col-span-3 py-2"
              subjectId={searchParams.subjectId}
              termId={searchParams.termId}
              term={selectedTerm}
              students={students}
            />
            <div className="gap2 flex flex-col">
              <div className="font-bold font-medium">Notes Précèdentes</div>
              <CurrentGradeSheetSummary
                subjectId={searchParams.subjectId}
                termId={searchParams.termId}
              />
            </div>
          </div>
        )}
    </>
  );
}
