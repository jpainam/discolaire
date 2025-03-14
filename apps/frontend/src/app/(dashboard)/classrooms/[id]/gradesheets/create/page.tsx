import { checkPermission } from "@repo/api/permission";
import { CreateGradeSheet } from "~/components/classrooms/gradesheets/grades/CreateGradeSheet";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";

export default async function Page() {
  const canCreateGradeSheet = await checkPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );
  if (!canCreateGradeSheet) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return <CreateGradeSheet />;
}
