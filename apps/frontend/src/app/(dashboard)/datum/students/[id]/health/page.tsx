import { EmptyState } from "@repo/ui/EmptyState";

import { HealthVisitHeader } from "~/components/students/health/HealthVisitHeader";
import { HealthVisitTable } from "~/components/students/health/HealthVisitTable";
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
    <div className="flex w-full flex-col">
      <HealthVisitHeader />
      <HealthVisitTable userId={student.userId} className="mx-2" />
    </div>
  );
}
