import type { PropsWithChildren } from "react";

import { ProgramList } from "~/components/classrooms/programs/ProgramList";

export default function Layout({
  children,
  params: { id },
}: PropsWithChildren<{ params: { id: string } }>) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <ProgramList classroomId={id} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
