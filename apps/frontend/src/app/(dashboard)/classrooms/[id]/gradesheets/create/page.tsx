import { checkPermission } from "@repo/api/permission";
import { CreateGradeSheet } from "~/components/classrooms/gradesheets/grades/CreateGradeSheet";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const canCreateGradeSheet = await checkPermission(
    "gradesheet",
    PermissionAction.CREATE
  );

  if (!canCreateGradeSheet) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  const params = await props.params;
  const students = await caller.classroom.students(params.id);
  return <CreateGradeSheet students={students} />;
}
