import { EmptyComponent } from "~/components/EmptyComponent";
import { CreateEditHealthVisit } from "~/components/students/health/CreateEditHealthVisit";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page(props: {
  params: Promise<{ id: string; healthId: string }>;
}) {
  const params = await props.params;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const visit = await caller.health.getVisit(params.healthId);
  const student = await caller.student.get(params.id);
  if (!student.userId) {
    return <EmptyComponent title="No user id yet" />;
  }
  return (
    <CreateEditHealthVisit
      name={getFullName(student)}
      userId={student.userId}
    />
  );
}
