import { checkPermission } from "@repo/api/permission";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";
import { caller } from "~/trpc/server";
import { CreateEditSchool } from "./CreateEditSchool";

export default async function Page(props: {
  params: Promise<{ schoolId: string }>;
}) {
  const params = await props.params;

  const canUpdateSchool = await checkPermission(
    "school",
    PermissionAction.UPDATE
  );
  if (!canUpdateSchool) {
    return <NoPermission className="my-8" />;
  }

  const { schoolId } = params;

  const school = await caller.school.get(schoolId);

  return <CreateEditSchool school={school} />;
}
