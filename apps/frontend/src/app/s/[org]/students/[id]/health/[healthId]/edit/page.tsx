import { EmptyState } from "~/components/EmptyState";
import { CreateEditHealthVisit } from "~/components/students/health/CreateEditHealthVisit";
import { caller } from "~/trpc/server";
import { getFullName } from "~/utils";

export default async function Page(props: {
  params: Promise<{ id: string; healthId: string }>;
}) {
  const params = await props.params;
  const visit = await caller.health.getVisit(params.healthId);
  console.log(visit);
  const student = await caller.student.get(params.id);
  if (!student.userId) {
    return <EmptyState className="my-8" title="No user id yet" />;
  }
  return (
    <CreateEditHealthVisit
      name={getFullName(student)}
      userId={student.userId}
    />
  );
}
