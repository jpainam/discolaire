import { caller } from "~/trpc/server";
import { CreateEditSchool } from "./CreateEditSchool";

export default async function Page(props: {
  params: Promise<{ schoolId: string }>;
}) {
  const params = await props.params;

  const { schoolId } = params;

  const school = await caller.school.get(schoolId);

  return <CreateEditSchool school={school} />;
}
