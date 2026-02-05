import { NoPermission } from "~/components/no-permission";
import { checkPermission } from "~/permissions/server";
import { caller } from "~/trpc/server";
import { CreateEditSchool } from "./CreateEditSchool";

export default async function Page(props: {
  params: Promise<{ schoolId: string }>;
}) {
  const params = await props.params;

  const canUpdateSchool = await checkPermission("school.update");
  if (!canUpdateSchool) {
    return <NoPermission />;
  }

  const { schoolId } = params;

  const school = await caller.school.get(schoolId);

  return <CreateEditSchool school={school} />;
}
