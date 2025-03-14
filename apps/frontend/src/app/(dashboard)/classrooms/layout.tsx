import React from "react";

import { ClassroomHeader } from "~/components/classrooms/ClassroomHeader";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const classrooms = await api.classroom.all();
  return (
    <div className="flex flex-1  flex-col">
      <ClassroomHeader classrooms={classrooms} />
      {children}
    </div>
  );
}
