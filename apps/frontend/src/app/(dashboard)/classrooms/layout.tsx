import React from "react";

import { checkPermissions } from "@repo/api/permission";
import { ClassroomHeader } from "~/components/classrooms/ClassroomHeader";
import { PermissionAction } from "~/permissions";
import { api } from "~/trpc/server";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const canReadClassroom = await checkPermissions(
    PermissionAction.READ,
    "classroom:list"
  );
  if (!canReadClassroom) {
    console.warn("No permission");
    //return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  const classrooms = await api.classroom.all();
  return (
    <div className="flex flex-1  flex-col">
      <ClassroomHeader classrooms={classrooms} />
      {children}
    </div>
  );
}
