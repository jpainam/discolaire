import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";
import { checkPermission } from "~/permissions/server";
import { getQueryClient, trpc } from "~/trpc/server";
import { ClassroomCreateGradesheet } from "./ClassroomCreateGradsheet";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page(props: PageProps) {
  const params = await props.params;
  const canCreateGradeSheet = await checkPermission(
    "gradesheet",
    PermissionAction.CREATE,
  );

  if (!canCreateGradeSheet) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  const queryClient = getQueryClient();
  const terms = await queryClient.fetchQuery(trpc.term.all.queryOptions());

  const students = await queryClient.fetchQuery(
    trpc.classroom.students.queryOptions(params.id),
  );
  return <ClassroomCreateGradesheet terms={terms} students={students} />;
}
