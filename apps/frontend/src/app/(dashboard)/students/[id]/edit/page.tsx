import { NoPermission } from "~/components/no-permission";
import { UpdateStudent } from "~/components/students/profile/UpdateStudent";
import { checkPermission } from "~/permissions/server";
import { caller } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;

  const { id } = params;

  const student = await caller.student.get(id);
  const canEditStudent = await checkPermission("student", "update");
  if (!canEditStudent) {
    return <NoPermission className="my-8" />;
  }

  return <UpdateStudent student={student} />;
}
