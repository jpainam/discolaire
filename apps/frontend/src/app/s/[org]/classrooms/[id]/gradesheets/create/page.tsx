import type { SearchParams } from "nuqs/server";
import { createLoader } from "nuqs/server";

import { CreateGradeSheet } from "~/components/classrooms/gradesheets/grades/CreateGradeSheet";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { caller } from "~/trpc/server";
import { ClassroomCreateGradeSheetHeader } from "./ClassroomCreateGradeSheetHeader";
import { createGradeSheetSearchSchema } from "./search-params";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<SearchParams>;
}
const gradeSheetSearchLoader = createLoader(createGradeSheetSearchSchema);

export default async function Page(props: PageProps) {
  const searchParams = await gradeSheetSearchLoader(props.searchParams);
  const params = await props.params;
  const canCreateGradeSheet = await checkPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );

  if (!canCreateGradeSheet) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }

  const students = await caller.classroom.students(params.id);
  return (
    <div className="flex flex-col">
      <ClassroomCreateGradeSheetHeader />
      <div className="grid h-screen grid-cols-[1fr_300px] gap-4 divide-x">
        {searchParams.termId && searchParams.subjectId && (
          <CreateGradeSheet
            subjectId={searchParams.subjectId}
            termId={searchParams.termId}
            students={students}
          />
        )}
        <div>Info des saisie precedente</div>
      </div>
    </div>
  );
}
