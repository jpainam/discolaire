import { api } from "~/trpc/server";
import Edit from "./Edit";

export default async function Page(props: {
  params: Promise<{ schoolId: string }>;
}) {
  const params = await props.params;

  const { schoolId } = params;

  const school = await api.school.get(schoolId);

  return <Edit school={school} />;
}
