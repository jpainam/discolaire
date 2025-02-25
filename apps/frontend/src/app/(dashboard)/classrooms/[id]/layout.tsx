import React from "react";

import { checkPermissions } from "@repo/api/permission";
import { PermissionAction } from "~/permissions";

import { ClassroomHeader } from "~/components/classrooms/ClassroomHeader";
import { ClassroomSidebar } from "~/components/classrooms/ClassroomSidebar";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  const { id } = params;

  const { children } = props;
  const canReadStudent = await checkPermissions(
    PermissionAction.READ,
    "classroom:details",
    {
      id: id,
    },
  );
  if (!canReadStudent) {
    console.warn("No permission");
    //return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return (
    <div className="flex flex-1 flex-row">
      <ClassroomSidebar className="hidden border-r md:block" />
      <div className="w-full flex-col md:ml-[220px]">
        <ClassroomHeader />
        {children}
      </div>
    </div>
  );
}
