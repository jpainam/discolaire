import { EmptyState } from "@repo/ui/EmptyState";

import { api } from "~/trpc/server";
import { DocumentGrid } from "./DocumentGrid";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const student = await api.student.get(params.id);
  if (!student.userId) {
    return <EmptyState title="No user attached to the student" />;
  }
  const documents = await api.health.documents({ userId: student.userId });
  if (!documents.length) {
    return <EmptyState title="No health documents found" />;
  }
  return (
    <div>
      <DocumentGrid />
    </div>
  );
}
