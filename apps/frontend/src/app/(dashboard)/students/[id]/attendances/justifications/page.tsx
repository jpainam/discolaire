import { EmptyState } from "~/components/EmptyState";

import { JustificationAbsence } from "~/components/students/attendances/justifications/JustificationAbsence";
import { api } from "~/trpc/server";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const justificationAbsences = await api.absence.studentJustifications({
    studentId: params.id,
  });
  const justificationLatenesses = await api.lateness.studentJustifications({
    studentId: params.id,
  });
  if (
    justificationAbsences.length == 0 &&
    justificationLatenesses.length == 0
  ) {
    return <EmptyState className="py-8" />;
  }
  return (
    <div className="flex flex-col gap-2 p-2">
      <JustificationAbsence justifications={justificationAbsences} />
    </div>
  );
}
