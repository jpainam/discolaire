import { EmptyState } from "@repo/ui/EmptyState";

import { CreateEditHealthVisit } from "~/components/students/health/CreateEditHealthVisit";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await api.student.get(params.id);
  if (!student.userId) {
    return (
      <EmptyState className="py-8" title="No user attached to the student" />
    );
  }

  return (
    <div>
      <CreateEditHealthVisit userId={student.userId} />
    </div>
  );
}
