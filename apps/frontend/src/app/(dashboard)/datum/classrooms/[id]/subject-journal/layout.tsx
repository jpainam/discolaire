import type { PropsWithChildren } from "react";

import { SubjectList } from "./SubjectList";

export default function Layout({
  children,
  params: { id },
}: PropsWithChildren<{ params: { id: string } }>) {
  return (
    <div className="flex h-screen flex-col md:flex-row">
      <SubjectList classroomId={id} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
