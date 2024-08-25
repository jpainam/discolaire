import { EmptyState } from "@repo/ui/EmptyState";

import { ProgramList } from "~/components/classrooms/programs/ProgramList";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const subjects = await api.classroom.subjects({ id });
  if (!subjects) {
    return <EmptyState />;
  }
  return (
    <div className="flex w-full flex-row">
      <ProgramList classroomId={id} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
