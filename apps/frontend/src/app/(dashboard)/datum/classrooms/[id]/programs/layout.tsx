import React from "react";

import { ProgramList } from "~/components/classrooms/programs/ProgramList";

export default async function Layout(props: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;

  return (
    <div className="flex h-screen flex-col md:flex-row">
      <ProgramList classroomId={id} />
      <div className="flex-1">{children}</div>
    </div>
  );
}
