import React from "react";

import { checkPermission } from "@repo/api/permission";
import { auth } from "@repo/auth";
import { ClassroomHeader } from "~/components/classrooms/ClassroomHeader";
import { NoPermission } from "~/components/no-permission";
import { PermissionAction } from "~/permissions";
import { caller } from "~/trpc/server";

export default async function Layout(props: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { children } = props;
  const params = await props.params;

  let canReadClassroom = false;
  const session = await auth();
  if (session?.user.profile === "student") {
    const student = await caller.student.getFromUserId(session.user.id);
    const classroom = await caller.student.classroom({ studentId: student.id });
    if (classroom?.id === params.id) {
      canReadClassroom = true;
    }
  } else if (session?.user.profile === "contact") {
    const contact = await caller.contact.getFromUserId(session.user.id);
    const classrooms = await caller.contact.classrooms(contact.id);
    const classroomIds = classrooms.map((c) => c.id);
    canReadClassroom = classroomIds.includes(params.id);
  } else {
    canReadClassroom = await checkPermission(
      "classroom",
      PermissionAction.READ
    );
  }

  if (!canReadClassroom) {
    return <NoPermission className="my-8" isFullPage={true} resourceText="" />;
  }
  return (
    <div className="grid grid-cols-1">
      <ClassroomHeader />
      {children}
    </div>
  );
}
