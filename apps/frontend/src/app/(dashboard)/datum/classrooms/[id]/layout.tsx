import React from "react";

import { ClassroomHeader } from "~/components/classrooms/ClassroomHeader";
import { ClassroomSidebar } from "~/components/classrooms/ClassroomSidebar";

export default async function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  // const canReadStudent = await checkPermissions(
  //   PermissionAction.READ,
  //   "classroom",
  //   {
  //     id: id,
  //   }
  // );
  // if (!canReadStudent) {
  //   return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  // }
  return (
    <div className="flex flex-row">
      <ClassroomSidebar />
      <div className="flex-1 flex-col border-l">
        <ClassroomHeader />
        {children}
      </div>
    </div>
  );
}
